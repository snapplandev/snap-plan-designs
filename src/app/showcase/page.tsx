"use client";

import * as React from "react";
import {
    Button,
    IconButton,
    SplitButton,
    SegmentedControl,
    Input,
    Textarea,
    Select,
    SearchField,
    Checkbox,
    Radio,
    Switch,
    Slider,
    Stepper,
    DatePicker,
    TimePicker,
    Chip,
    Badge,
    Tooltip,
    Popover,
    AlertBanner,
    Modal,
    BottomSheet,
    Tabs,
    Accordion,
    Card,
    DataTable,
    Pagination
} from "@/components/ui";
import {
    Search,
    Plus,
    Settings,
    Mail,
    User,
    Layout
} from "lucide-react";

export default function ComponentShowcase() {
    const [searchValue, setSearchValue] = React.useState("");
    const [stepperValue, setStepperValue] = React.useState(5);
    const [activeTab, setActiveTab] = React.useState("base");
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-bg p-8 pb-24">
            <div className="container mx-auto max-w-6xl space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="text-display font-bold text-text-primary">Design System Showcase</h1>
                    <p className="text-body-lg text-text-secondary">Snap Plan Designs Core Component Library</p>
                </div>

                {/* Categories */}
                <Tabs
                    variant="underline"
                    value={activeTab}
                    onChange={(value: string) => setActiveTab(value)}
                    options={[
                        { label: "Base", value: "base" },
                        { label: "Inputs", value: "inputs" },
                        { label: "Feedback", value: "feedback" },
                        { label: "Navigation", value: "navigation" },
                    ]}
                />

                {activeTab === "base" && (
                    <div className="grid gap-12">
                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Buttons</h2>
                            <div className="flex flex-wrap gap-4 items-end">
                                <Button variant="primary">Primary Button</Button>
                                <Button variant="secondary">Secondary Button</Button>
                                <Button variant="tertiary">Tertiary Button</Button>
                                <Button variant="primary" isLoading>Loading</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                            <div className="flex flex-wrap gap-4 items-end">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Icon Buttons & Split</h2>
                            <div className="flex flex-wrap gap-6 items-center">
                                <div className="flex gap-2">
                                    <IconButton variant="filled" size="md" aria-label="Settings"><Settings className="h-4 w-4" /></IconButton>
                                    <IconButton variant="outline" size="md" aria-label="Mail"><Mail className="h-4 w-4" /></IconButton>
                                    <IconButton variant="ghost" size="md" aria-label="Plus"><Plus className="h-4 w-4" /></IconButton>
                                </div>
                                <SplitButton variant="primary" size="md">
                                    Action
                                </SplitButton>
                                <SplitButton variant="secondary" size="lg">
                                    Submit
                                </SplitButton>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Segmented Control</h2>
                            <SegmentedControl
                                count={3}
                                value="2"
                                onChange={(value: string) => { }}
                                options={[
                                    { label: "Option 1", value: "1" },
                                    { label: "Option 2", value: "2" },
                                    { label: "Option 3", value: "3" },
                                ]}
                            />
                        </section>
                    </div>
                )}

                {activeTab === "inputs" && (
                    <div className="grid gap-12">
                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Form Controls</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Input placeholder="Standard Input" />
                                    <Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search style..." />
                                    <Input state="error" placeholder="Error state" />
                                    <Select
                                        options={[
                                            { label: "Select an option", value: "" },
                                            { label: "Option A", value: "a" },
                                            { label: "Option B", value: "b" },
                                        ]}
                                    />
                                    <SearchField
                                        value={searchValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                                        onClear={() => setSearchValue("")}
                                        placeholder="Global Search"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Textarea placeholder="Tell us more..." />
                                    <div className="flex gap-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2"><Checkbox checked /> <span className="text-label">Active</span></div>
                                            <div className="flex items-center gap-2"><Checkbox /> <span className="text-label">Rest</span></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2"><Radio checked /> <span className="text-label">Selected</span></div>
                                            <div className="flex items-center gap-2"><Radio /> <span className="text-label">Choice</span></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 items-center">
                                        <Switch checked />
                                        <Stepper value={stepperValue} onChange={(value: number) => setStepperValue(value)} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Pickers & Sliders</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <DatePicker />
                                <TimePicker />
                                <Slider value={45} />
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "feedback" && (
                    <div className="grid gap-12">
                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Chips & Badges</h2>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Chip variant="tonal" onRemove={() => { }}>Design System</Chip>
                                <Chip variant="filled" leadingIcon={<User className="h-3 w-3" />}>Admin</Chip>
                                <Chip variant="outline">Draft</Chip>
                                <div className="flex gap-2 ml-8">
                                    <Badge variant="primary">New</Badge>
                                    <Badge variant="success">Active</Badge>
                                    <Badge variant="warning">Pending</Badge>
                                    <Badge variant="error">Error</Badge>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Overlays & Alerts</h2>
                            <div className="space-y-4">
                                <AlertBanner title="System Update" variant="info">
                                    We&apos;ll be performing scheduled maintenance tonight at 12 PM.
                                </AlertBanner>
                                <div className="flex gap-4">
                                    <Tooltip content="Useful hint here">
                                        <Button variant="tertiary">Hover for Tooltip</Button>
                                    </Tooltip>
                                    <Popover trigger={<Button variant="tertiary">Open Popover</Button>}>
                                        <div className="space-y-2">
                                            <h4 className="font-bold">Settings</h4>
                                            <p className="text-label text-text-secondary">Configure your display preferences here.</p>
                                        </div>
                                    </Popover>
                                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                                    <Button variant="secondary" onClick={() => setIsBottomSheetOpen(true)}>Open Sheet</Button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "navigation" && (
                    <div className="grid gap-12">
                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Cards & Lists</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card variant="elevated" className="p-6 space-y-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Layout className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Dashboard Layout</h3>
                                    <p className="text-label text-text-secondary">Manage your projects with ease using our new view.</p>
                                </Card>
                                <Card variant="outlined" className="p-6">
                                    <h3 className="font-bold mb-2">Standard Card</h3>
                                    <p className="text-label text-text-secondary">Used for grouping related information together.</p>
                                </Card>
                                <Card variant="interactive" className="p-6">
                                    <h3 className="font-bold mb-2">Flat Style</h3>
                                    <p className="text-label text-text-secondary">Subtle background for less emphasis.</p>
                                </Card>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Data Table & Pagination</h2>
                            <DataTable
                                headers={["Project", "Status", "Owner"]}
                                rows={[
                                    ["Snap Plan UI", <Badge key="1" variant="success">Active</Badge>, "Alice"],
                                    ["Mobile App", <Badge key="2" variant="warning">Review</Badge>, "Bob"],
                                    ["Design Spec", <Badge key="3" variant="primary">New</Badge>, "Charlie"],
                                ]}
                            />
                            <Pagination currentPage={1} totalPages={5} onPageChange={(page: number) => { }} />
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-body-lg font-bold border-b pb-2">Accordion</h2>
                            <Accordion title="How do I change my theme?">
                                You can change your theme in the settings panel located in the top-right corner of the dashboard.
                            </Accordion>
                            <Accordion title="Are there breaking changes?">
                                The new system uses CVA and strict naming conventions. Some refactoring of existing components might be required.
                            </Accordion>
                        </section>
                    </div>
                )}

                {/* Modal/BottomSheet Examples */}
                {isModalOpen && (
                    <Modal title="Create New Project" onClose={() => setIsModalOpen(false)}>
                        <div className="space-y-4">
                            <Input placeholder="Project Name" />
                            <Select options={[{ label: "Website", value: "web" }, { label: "Mobile", value: "mobile" }]} />
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsModalOpen(false)}>Create</Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {isBottomSheetOpen && (
                    <BottomSheet onClose={() => setIsBottomSheetOpen(false)}>
                        <div className="space-y-6">
                            <h3 className="text-body-lg font-bold">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="secondary" className="h-24 flex-col gap-2">
                                    <Plus className="h-6 w-6" />
                                    New Entry
                                </Button>
                                <Button variant="secondary" className="h-24 flex-col gap-2">
                                    <Mail className="h-6 w-6" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </BottomSheet>
                )}
            </div>
        </div>
    );
}
