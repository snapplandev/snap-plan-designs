import type { Project, ProjectDetailsById } from "@/lib/data/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "North Shore Residence",
    location: "Evanston, IL",
    propertyType: "Remodel",
    status: "in_progress",
    updatedAt: "2026-02-12",
  },
  {
    id: "2",
    title: "Hudson Brownstone",
    location: "Brooklyn, NY",
    propertyType: "Addition",
    status: "submitted",
    updatedAt: "2026-02-10",
  },
  {
    id: "3",
    title: "Canyon Guest Pavilion",
    location: "Scottsdale, AZ",
    propertyType: "New Build",
    status: "delivered",
    updatedAt: "2026-02-08",
  },
  {
    id: "4",
    title: "Seaboard Atelier",
    location: "Charleston, SC",
    propertyType: "Renovation",
    status: "in_review",
    updatedAt: "2026-02-03",
  },
];

export const mockProjectDetails: ProjectDetailsById = {
  "1": {
    project: mockProjects[0],
    summary: {
      goals: "Improve daylight into kitchen and breakfast zone.",
      constraints: "Preserve existing structural beam line.",
      mustHaves: "Walk-in pantry connected to mudroom.",
      dimensions: "26' x 34' main floor footprint",
      ceilingHeight: "9 ft main floor",
      measurementNotes: "Existing utility wall depth is approximately 11 inches.",
    },
    packageDetails: {
      tier: "Standard Residential Set",
      revisionsIncluded: "2 rounds included",
      turnaround: "7-10 business days",
    },
    messages: [
      {
        id: "message-1",
        sender: "Snap Plan",
        body: "Intake package received. We are reviewing your references and scope notes.",
        createdAt: "2026-02-11T10:18:00.000Z",
      },
      {
        id: "message-2",
        sender: "Client",
        body: "Great. Please prioritize kitchen circulation and pantry access in the first pass.",
        createdAt: "2026-02-11T13:42:00.000Z",
      },
    ],
    revisions: [
      {
        id: "revision-1",
        title: "Pantry Door Swing",
        details: "Adjust swing to avoid conflict with island clearance path.",
        status: "resolved",
        createdAt: "2026-02-09T14:18:00.000Z",
      },
      {
        id: "revision-2",
        title: "Mudroom Bench Length",
        details: "Extend bench by 18 inches and align hooks with cabinet centerline.",
        status: "in_progress",
        createdAt: "2026-02-12T09:35:00.000Z",
      },
    ],
    files: [
      {
        id: "upload-1",
        name: "existing-site-photos.zip",
        size: 1245000,
        mimeType: "application/zip",
        group: "upload",
        createdAt: "2026-02-10T09:18:00.000Z",
      },
      {
        id: "upload-2",
        name: "kitchen-dimensions.pdf",
        size: 245600,
        mimeType: "application/pdf",
        group: "upload",
        createdAt: "2026-02-10T09:20:00.000Z",
      },
    ],
  },
  "2": {
    project: mockProjects[1],
    summary: {
      goals: "Increase ground-floor circulation for entertaining.",
      constraints: "Landmark facade must remain untouched.",
      mustHaves: "Concealed storage wall near stair hall.",
      dimensions: "19' x 42' lot depth",
      ceilingHeight: "10 ft parlor floor",
      measurementNotes: "Rear extension offset by neighboring easement line.",
    },
    packageDetails: {
      tier: "Premium Layout Study",
      revisionsIncluded: "3 rounds included",
      turnaround: "10-12 business days",
    },
    messages: [
      {
        id: "message-3",
        sender: "Snap Plan",
        body: "Your archival drawings were imported for baseline alignment.",
        createdAt: "2026-02-10T08:11:00.000Z",
      },
    ],
    revisions: [],
    files: [
      {
        id: "upload-3",
        name: "archival-floor-plan.pdf",
        size: 512200,
        mimeType: "application/pdf",
        group: "upload",
        createdAt: "2026-02-09T15:45:00.000Z",
      },
    ],
  },
  "3": {
    project: mockProjects[2],
    summary: {
      goals: "Create a detached guest pavilion with private courtyard edge.",
      constraints: "Preserve established desert landscaping.",
      mustHaves: "Integrated wet bar and media wall.",
      dimensions: "32' x 18' pavilion footprint",
      ceilingHeight: "12 ft living zone",
      measurementNotes: "Civil grading notes require minimum threshold elevation.",
    },
    packageDetails: {
      tier: "Permit-Ready Drawing Pack",
      revisionsIncluded: "1 round included",
      turnaround: "5-7 business days",
    },
    messages: [
      {
        id: "message-4",
        sender: "Snap Plan",
        body: "Permit-ready sheets are complete and uploaded to deliverables.",
        createdAt: "2026-02-08T16:20:00.000Z",
      },
    ],
    revisions: [
      {
        id: "revision-3",
        title: "Courtyard Gate Width",
        details: "Increase gate opening by 6 inches for maintenance clearance.",
        status: "resolved",
        createdAt: "2026-02-07T12:04:00.000Z",
      },
    ],
    files: [
      {
        id: "deliverable-1",
        name: "permit-ready-floor-plan.pdf",
        size: 1420380,
        mimeType: "application/pdf",
        group: "deliverable",
        createdAt: "2026-02-08T16:22:00.000Z",
      },
      {
        id: "deliverable-2",
        name: "sheet-index.pdf",
        size: 198040,
        mimeType: "application/pdf",
        group: "deliverable",
        createdAt: "2026-02-08T16:23:00.000Z",
      },
    ],
  },
  "4": {
    project: mockProjects[3],
    summary: {
      goals: "Finalize studio layout for mixed residential and workspace use.",
      constraints: "Preserve original masonry fireplace and adjacent chimney chase.",
      mustHaves: "Dedicated drafting table zone and lockable materials storage.",
      dimensions: "28' x 22' main studio floor",
      ceilingHeight: "11 ft",
      measurementNotes: "Existing joist spacing varies between 14 and 18 inches.",
    },
    packageDetails: {
      tier: "Layout + Millwork Coordination",
      revisionsIncluded: "2 rounds included",
      turnaround: "8-10 business days",
    },
    messages: [],
    revisions: [],
    files: [],
  },
};
