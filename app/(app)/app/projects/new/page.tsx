"use client";

import { useEffect, useReducer, useRef, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";

import Field from "@/components/intake/Field";
import StepHeader from "@/components/intake/StepHeader";
import WizardShell from "@/components/intake/WizardShell";
import Button from "@/components/ui/Button";
import { createProjectDraft } from "@/lib/data/client";
import type { ProjectFileInput } from "@/lib/data/types";

type PropertyType = "" | "remodel" | "basement" | "addition" | "other";

type IntakeFormFields = {
  title: string;
  propertyType: PropertyType;
  city: string;
  state: string;
  goals: string;
  constraints: string;
  mustHaves: string;
  dimensions: string;
  ceilingHeight: string;
  measurementNotes: string;
};

type IntakeState = {
  currentStep: number;
  fields: IntakeFormFields;
  files: File[];
  dropActive: boolean;
  notice: string | null;
  submitPending: boolean;
};

type IntakeAction =
  | { type: "UPDATE_FIELD"; field: keyof IntakeFormFields; value: string }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "SET_DROP_ACTIVE"; dropActive: boolean }
  | { type: "SET_NOTICE"; notice: string | null }
  | { type: "SET_SUBMIT_PENDING"; submitPending: boolean };

const WIZARD_STEPS = [
  {
    id: "basics",
    title: "Basics",
    guidance: "Start with the project fundamentals so the studio can frame the scope quickly.",
  },
  {
    id: "goals",
    title: "Goals & constraints",
    guidance: "Clarify what success looks like and where the boundaries are before design work begins.",
  },
  {
    id: "measurements",
    title: "Measurements",
    guidance: "Provide whatever dimensions you already know to reduce early revision cycles.",
  },
  {
    id: "uploads",
    title: "Uploads",
    guidance: "Attach plans, photos, and references to establish context for your intake.",
  },
  {
    id: "review",
    title: "Review",
    guidance: "Confirm details before sending your intake to the project dashboard.",
  },
] as const;

const LAST_STEP_INDEX = WIZARD_STEPS.length - 1;
const REDIRECT_DELAY_MS = 1100;

const ACCEPTED_FILE_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

const INITIAL_STATE: IntakeState = {
  currentStep: 0,
  fields: {
    title: "",
    propertyType: "",
    city: "",
    state: "",
    goals: "",
    constraints: "",
    mustHaves: "",
    dimensions: "",
    ceilingHeight: "",
    measurementNotes: "",
  },
  files: [],
  dropActive: false,
  notice: null,
  submitPending: false,
};

/**
 * Reducer for wizard navigation and local-only intake data updates.
 * Edge case: step index is clamped to prevent out-of-range transitions.
 */
function intakeReducer(state: IntakeState, action: IntakeAction): IntakeState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value,
        },
      };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, LAST_STEP_INDEX),
      };
    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...action.files],
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.index),
      };
    case "SET_DROP_ACTIVE":
      return {
        ...state,
        dropActive: action.dropActive,
      };
    case "SET_NOTICE":
      return {
        ...state,
        notice: action.notice,
      };
    case "SET_SUBMIT_PENDING":
      return {
        ...state,
        submitPending: action.submitPending,
      };
    default:
      return state;
  }
}

/**
 * Step-level completion rules for gating wizard progression.
 * Edge case: non-required steps always return true for MVP flexibility.
 */
function isStepComplete(stepIndex: number, fields: IntakeFormFields): boolean {
  if (stepIndex === 0) {
    return fields.title.trim().length > 0;
  }
  if (stepIndex === 1) {
    return fields.goals.trim().length > 0;
  }
  return true;
}

/**
 * File whitelist check for drag/drop and picker sources.
 * Edge case: falls back to extension matching when file.type is empty.
 */
function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_FILE_MIME_TYPES.has(file.type)) {
    return true;
  }
  const lowercaseName = file.name.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((extension) => lowercaseName.endsWith(extension));
}

/**
 * Human-readable byte formatter for file list metadata.
 * Edge case: keeps small files in bytes and rounds KB/MB values.
 */
function formatFileSize(fileSizeInBytes: number): string {
  const kibibyte = 1024;
  const mebibyte = kibibyte * 1024;

  if (fileSizeInBytes < kibibyte) {
    return `${fileSizeInBytes} B`;
  }
  if (fileSizeInBytes < mebibyte) {
    return `${(fileSizeInBytes / kibibyte).toFixed(1)} KB`;
  }
  return `${(fileSizeInBytes / mebibyte).toFixed(1)} MB`;
}

/**
 * New project intake wizard page bound to the data adapter create action.
 * Edge case: failed adapter writes keep the user on review step with an actionable error.
 */
export default function NewProjectPage() {
  const router = useRouter();
  const redirectTimerRef = useRef<number | null>(null);
  const [state, dispatch] = useReducer(intakeReducer, INITIAL_STATE);

  const isCurrentStepComplete = isStepComplete(state.currentStep, state.fields);
  const isLastStep = state.currentStep === LAST_STEP_INDEX;

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const updateField = (field: keyof IntakeFormFields, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleNext = () => {
    if (!isCurrentStepComplete || isLastStep || state.submitPending) {
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  };

  const handleBack = () => {
    if (state.currentStep === 0 || state.submitPending) {
      return;
    }
    dispatch({ type: "PREVIOUS_STEP" });
  };

  const handleFileSelection = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }
    const nextFiles = Array.from(fileList).filter(isAcceptedFile);
    if (nextFiles.length > 0) {
      dispatch({ type: "ADD_FILES", files: nextFiles });
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files);
    event.currentTarget.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_ACTIVE", dropActive: true });
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_ACTIVE", dropActive: false });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch({ type: "SET_DROP_ACTIVE", dropActive: false });
    handleFileSelection(event.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (state.submitPending) {
      return;
    }
    dispatch({
      type: "SET_NOTICE",
      notice: "Intake captured. Creating your project workspace...",
    });
    dispatch({ type: "SET_SUBMIT_PENDING", submitPending: true });

    try {
      const uploadedFiles: ProjectFileInput[] = state.files.map((file) => ({
        name: file.name,
        size: file.size,
        mimeType: file.type || "Unknown type",
      }));

      const project = await createProjectDraft({
        title: state.fields.title,
        propertyType: state.fields.propertyType,
        city: state.fields.city,
        state: state.fields.state,
        goals: state.fields.goals,
        constraints: state.fields.constraints,
        mustHaves: state.fields.mustHaves,
        dimensions: state.fields.dimensions,
        ceilingHeight: state.fields.ceilingHeight,
        measurementNotes: state.fields.measurementNotes,
        files: uploadedFiles,
      });

      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
      redirectTimerRef.current = window.setTimeout(() => {
        router.push(`/app/projects/${project.id}`);
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      dispatch({
        type: "SET_NOTICE",
        notice:
          error instanceof Error
            ? `Unable to create project: ${error.message}`
            : "Unable to create project. Please try again.",
      });
      dispatch({ type: "SET_SUBMIT_PENDING", submitPending: false });
    }
  };

  const titleError =
    state.currentStep === 0 && state.fields.title.trim().length === 0
      ? "Project title is required before continuing."
      : undefined;

  const goalsError =
    state.currentStep === 1 && state.fields.goals.trim().length === 0
      ? "Goals are required before continuing."
      : undefined;

  return (
    <WizardShell
      backDisabled={state.currentStep === 0 || state.submitPending}
      currentStep={state.currentStep}
      nextDisabled={!isCurrentStepComplete || isLastStep || state.submitPending}
      onBack={handleBack}
      onNext={handleNext}
      steps={WIZARD_STEPS}
    >
      {state.currentStep === 0 ? (
        <div className="intake-step">
          <StepHeader guidance={WIZARD_STEPS[0].guidance} title={WIZARD_STEPS[0].title} />
          <div className="intake-step__body">
            <Field
              error={titleError}
              helperText="Use the working name your team will recognize internally."
              htmlFor="intake-title"
              label="Project title"
              required
            >
              <input
                className="intake-input"
                id="intake-title"
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="North Shore Residence"
                type="text"
                value={state.fields.title}
              />
            </Field>

            <Field
              helperText="Select the closest category. You can refine scope later."
              htmlFor="intake-property-type"
              label="Property type"
            >
              <select
                className="intake-input intake-input--select"
                id="intake-property-type"
                onChange={(event) => updateField("propertyType", event.target.value as PropertyType)}
                value={state.fields.propertyType}
              >
                <option value="">Select property type</option>
                <option value="remodel">Remodel</option>
                <option value="basement">Basement</option>
                <option value="addition">Addition</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <div className="intake-grid intake-grid--two-col">
              <Field htmlFor="intake-city" label="City">
                <input
                  className="intake-input"
                  id="intake-city"
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Evanston"
                  type="text"
                  value={state.fields.city}
                />
              </Field>
              <Field htmlFor="intake-state" label="State">
                <input
                  className="intake-input"
                  id="intake-state"
                  onChange={(event) => updateField("state", event.target.value)}
                  placeholder="IL"
                  type="text"
                  value={state.fields.state}
                />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {state.currentStep === 1 ? (
        <div className="intake-step">
          <StepHeader guidance={WIZARD_STEPS[1].guidance} title={WIZARD_STEPS[1].title} />
          <div className="intake-step__body">
            <Field
              error={goalsError}
              helperText="Describe the primary outcomes you want this project to achieve."
              htmlFor="intake-goals"
              label="Goals"
              required
            >
              <textarea
                className="intake-input intake-input--textarea"
                id="intake-goals"
                onChange={(event) => updateField("goals", event.target.value)}
                placeholder="Example: improve circulation, bring more natural light, and open the kitchen."
                rows={5}
                value={state.fields.goals}
              />
            </Field>

            <Field
              helperText="Budget, timeline, permitting, HOA, structural, or any known boundaries."
              htmlFor="intake-constraints"
              label="Constraints"
            >
              <textarea
                className="intake-input intake-input--textarea"
                id="intake-constraints"
                onChange={(event) => updateField("constraints", event.target.value)}
                placeholder="Share practical boundaries and non-negotiables."
                rows={4}
                value={state.fields.constraints}
              />
            </Field>

            <Field
              helperText="List elements you absolutely want included in the final plan."
              htmlFor="intake-must-haves"
              label="Must-haves"
            >
              <textarea
                className="intake-input intake-input--textarea"
                id="intake-must-haves"
                onChange={(event) => updateField("mustHaves", event.target.value)}
                placeholder="Example: walk-in pantry, dedicated mudroom entry, expanded island seating."
                rows={4}
                value={state.fields.mustHaves}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {state.currentStep === 2 ? (
        <div className="intake-step">
          <StepHeader guidance={WIZARD_STEPS[2].guidance} title={WIZARD_STEPS[2].title} />
          <div className="intake-step__body">
            <Field
              helperText="Enter overall room dimensions, lot dimensions, or footprint if known."
              htmlFor="intake-dimensions"
              label="Known overall dimensions"
            >
              <input
                className="intake-input"
                id="intake-dimensions"
                onChange={(event) => updateField("dimensions", event.target.value)}
                placeholder="Example: 26' x 34' main floor footprint"
                type="text"
                value={state.fields.dimensions}
              />
            </Field>

            <Field htmlFor="intake-ceiling-height" label="Ceiling height">
              <input
                className="intake-input"
                id="intake-ceiling-height"
                onChange={(event) => updateField("ceilingHeight", event.target.value)}
                placeholder="Example: 9 ft main floor"
                type="text"
                value={state.fields.ceilingHeight}
              />
            </Field>

            <Field
              helperText="Use this for anything measurement-related that does not fit above."
              htmlFor="intake-measurement-notes"
              label="Notes"
            >
              <textarea
                className="intake-input intake-input--textarea"
                id="intake-measurement-notes"
                onChange={(event) => updateField("measurementNotes", event.target.value)}
                placeholder="Share rough dimensions, offsets, and known irregularities."
                rows={5}
                value={state.fields.measurementNotes}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {state.currentStep === 3 ? (
        <div className="intake-step">
          <StepHeader guidance={WIZARD_STEPS[3].guidance} title={WIZARD_STEPS[3].title} />
          <div className="intake-step__body">
            <div className="intake-upload">
              <div
                aria-label="Upload files by dragging and dropping or choosing files"
                className={[
                  "intake-upload__dropzone",
                  state.dropActive ? "intake-upload__dropzone--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                role="region"
              >
                <input
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="intake-upload__input"
                  id="intake-file-input"
                  multiple
                  onChange={handleFileInputChange}
                  type="file"
                />
                <p className="intake-upload__title">Drag files here</p>
                <p className="intake-upload__hint">Accepted formats: PDF, JPG, PNG.</p>
                <label className="button button--ghost intake-upload__choose" htmlFor="intake-file-input">
                  Choose files
                </label>
              </div>

              {state.files.length === 0 ? (
                <p className="intake-upload__empty">No files selected yet.</p>
              ) : (
                <ul aria-label="Selected files" className="intake-upload__list">
                  {state.files.map((file, index) => (
                    <li
                      className="intake-upload__item"
                      key={`${file.name}-${file.lastModified}-${index.toString()}`}
                    >
                      <div className="intake-upload__meta">
                        <p className="intake-upload__filename">{file.name}</p>
                        <p className="intake-upload__detail">
                          {file.type || "Unknown type"} • {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${file.name}`}
                        className="intake-upload__remove"
                        onClick={() => dispatch({ type: "REMOVE_FILE", index })}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {state.currentStep === 4 ? (
        <div className="intake-step">
          <StepHeader guidance={WIZARD_STEPS[4].guidance} title={WIZARD_STEPS[4].title} />
          <div className="intake-step__body">
            <section className="intake-review" aria-label="Intake review summary">
              <div className="intake-review__section">
                <h2 className="intake-review__heading">Basics</h2>
                <dl className="intake-review__list">
                  <div className="intake-review__row">
                    <dt>Project title</dt>
                    <dd>{state.fields.title || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Property type</dt>
                    <dd>{state.fields.propertyType || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Location</dt>
                    <dd>
                      {[state.fields.city, state.fields.state].filter(Boolean).join(", ") || "Not provided"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="intake-review__section">
                <h2 className="intake-review__heading">Goals & constraints</h2>
                <dl className="intake-review__list">
                  <div className="intake-review__row">
                    <dt>Goals</dt>
                    <dd>{state.fields.goals || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Constraints</dt>
                    <dd>{state.fields.constraints || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Must-haves</dt>
                    <dd>{state.fields.mustHaves || "Not provided"}</dd>
                  </div>
                </dl>
              </div>

              <div className="intake-review__section">
                <h2 className="intake-review__heading">Measurements & uploads</h2>
                <dl className="intake-review__list">
                  <div className="intake-review__row">
                    <dt>Overall dimensions</dt>
                    <dd>{state.fields.dimensions || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Ceiling height</dt>
                    <dd>{state.fields.ceilingHeight || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Measurement notes</dt>
                    <dd>{state.fields.measurementNotes || "Not provided"}</dd>
                  </div>
                  <div className="intake-review__row">
                    <dt>Files</dt>
                    <dd>{state.files.length > 0 ? `${state.files.length} selected` : "No files selected"}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {state.notice ? <p className="intake-submit-notice">{state.notice}</p> : null}

            <div className="intake-submit-row">
              <Button
                aria-label="Submit intake and return to dashboard"
                disabled={state.submitPending}
                onClick={() => {
                  void handleSubmit();
                }}
              >
                Submit Intake
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </WizardShell>
  );
}
