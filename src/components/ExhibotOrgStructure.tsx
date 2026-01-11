'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Users, Clock, Download, CheckSquare, Copy, ClipboardCheck, Video, ExternalLink } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

interface Role {
    title: string;
    name: string;
    email: string;
    scope: string;
    responsibilities: string[];
    eventRole: string;
    dailyDelivery: string;
    kpis: string[];
}

interface DailyScheduleItem {
    time: string;
    activity: string;
    owner: string;
}

interface DeliverableUpdate {
    roleIndex: number;
    kpiIndex: number;
    status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
    notes: string;
    lastUpdated: string;
}

interface RecurringMeeting {
    id: string;
    title: string;
    description: string;
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    time: string;
    duration: number;
    attendees: string[];
    meetingLink: string;
    type: 'daily' | 'weekly' | 'adhoc';
}

const ExhibotOrgStructure = () => {
    const [activeTab, setActiveTab] = useState<string>('orgchart');
    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const [deliverableUpdates, setDeliverableUpdates] = useState<DeliverableUpdate[]>([]);
    const [selectedTrackerRole, setSelectedTrackerRole] = useState<number | null>(null);
    const [copiedReport, setCopiedReport] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const roles: Role[] = [
        {
            title: 'CEO',
            name: 'Joel',
            email: 'joel@exhibot.ng',
            scope: 'Strategic + Marketing Owner',
            responsibilities: [
                'Vision and strategy',
                'Partnerships and sponsors',
                'Community and ecosystem',
                'Final decision-making',
                'MARKETING OWNERSHIP (all brand and messaging inputs)'
            ],
            eventRole: 'Event Owner + Marketing Lead',
            dailyDelivery: '5:00 PM daily',
            kpis: [
                'Event name, tagline, messaging pillars (Week 1)',
                'All marketing copy for design phases',
                'Sponsor commitments and assets',
                'Partner coordination'
            ]
        },
        {
            title: 'COO',
            name: 'Efemena Festus',
            email: 'oxfestus@proton.me',
            scope: 'Operations and Delivery',
            responsibilities: [
                'Event operations end-to-end',
                'Internal execution timelines',
                'Cross-team coordination',
                'Delivery tracking and escalation'
            ],
            eventRole: 'Event Lead - Timeline and Ops Owner',
            dailyDelivery: '6:00 PM daily',
            kpis: [
                'Master execution timeline (weekly updates)',
                'Venue data and layouts (Week 2)',
                'Event schedule and run of show (Week 3)',
                'Weekly execution report + risk register'
            ]
        },
        {
            title: 'CTO',
            name: 'David Onwuchekwa',
            email: 'onwuchekwachiwenizu55@gmail.com',
            scope: 'Technical and Robotics',
            responsibilities: [
                'Robotics competition framework',
                'Rules, specs, safety protocols',
                'Innovation challenge technical credibility',
                'School battlebot coordination'
            ],
            eventRole: 'Robotics/Technical Owner + School Liaison',
            dailyDelivery: '6:00 PM daily',
            kpis: [
                'Draft rules (Week 1)',
                'Final rules and specs (Week 2)',
                'School progress tracking (weekly)',
                'Safety documentation and judging criteria'
            ]
        },
        {
            title: 'CFO',
            name: 'Success Imhoeneghame',
            email: 'successolamotse@gmail.com',
            scope: 'Finance and Compliance',
            responsibilities: [
                'Budget ownership',
                'Vendor cost validation',
                'Sponsorship inflow tracking',
                'Print budgets and procurement'
            ],
            eventRole: 'Finance Owner',
            dailyDelivery: '5:00 PM daily',
            kpis: [
                'Event budget finalized (Week 1)',
                'Print budget and vendor approvals',
                'Sponsor payment tracking (weekly)',
                'Financial report and cost controls'
            ]
        },
        {
            title: 'Project Manager',
            name: 'Tobechukwu Nmanze',
            email: 'kngdr3y@gmail.com',
            scope: 'Execution Tracking',
            responsibilities: [
                'Timeline management',
                'Dependency tracking',
                'Deliverables monitoring',
                'Cross-functional coordination'
            ],
            eventRole: 'PM/Timeline Owner',
            dailyDelivery: '7:00 PM daily (consolidates all reports)',
            kpis: [
                'Daily delivery log published by 7 PM',
                'Dependency tracker updated daily',
                'Missed deliverables escalated immediately',
                'Weekly performance dashboard'
            ]
        },
        {
            title: 'Event Manager',
            name: 'Peace Momoh',
            email: 'peaceoomomoh@gmail.com',
            scope: 'Event Experience and Logistics',
            responsibilities: [
                'Venue coordination',
                'Event logistics',
                'Run of show execution',
                'On-ground team management'
            ],
            eventRole: 'Logistics Owner',
            dailyDelivery: '5:30 PM daily',
            kpis: [
                'Venue floor plans and measurements (Week 2)',
                'Stage/arena specs delivered',
                'Event schedule locked (Week 3)',
                'Vendor and volunteer coordination'
            ]
        },
        {
            title: 'Head of Design',
            name: 'Godstime Omagbitse',
            email: 'omagbitsegodstime16@gmail.com',
            scope: 'Visual Execution Lead',
            responsibilities: [
                'Design team leadership',
                'Quality control on all outputs',
                'Design guidelines enforcement',
                'Prioritization and resource allocation'
            ],
            eventRole: 'Design Lead - Output Owner',
            dailyDelivery: '6:30 PM daily',
            kpis: [
                'Design guidelines published (Day 1)',
                'Phase 1-3 outputs per timeline',
                'Quality review and approval system',
                'Designer workload management'
            ]
        },
        {
            title: 'Design Team Members',
            name: 'Irhibogbe Godstime, Imanudhuowo Oreva',
            email: 'iribhogbegodstime@gmail.com',
            scope: 'Execution Only',
            responsibilities: [
                'Execute designs per Design Lead direction',
                'Follow design guidelines strictly',
                'Deliver outputs within 2-5 days of receiving inputs',
                'No independent decisions - all through Design Lead'
            ],
            eventRole: 'Designers (Report to Design Lead)',
            dailyDelivery: '6:00 PM daily (to Design Lead)',
            kpis: [
                'Phase 1 assets (within 3-5 days)',
                'Phase 2 assets (Week 3-4)',
                'Phase 3 production files (Week 4-5)',
                'Revisions within 24 hours'
            ]
        },
        {
            title: 'Social Media Manager',
            name: 'Gloria & Peace',
            email: 'peaceoomomoh@gmail.com',
            scope: 'Content and Engagement',
            responsibilities: [
                'Content calendar ownership',
                'Platform strategy execution',
                'Event-day coverage plan',
                'Social copy for all design assets'
            ],
            eventRole: 'Social/Content Owner',
            dailyDelivery: '5:00 PM daily',
            kpis: [
                'Content calendar with copy (Week 1)',
                'Platform specs and hashtags',
                'Daily social copy for design team',
                'Event coverage plan finalized (Week 4)'
            ]
        },
        {
            title: 'Head of Partnerships',
            name: 'James Salami',
            email: 'partnerships@exhibot.ng',
            scope: 'Partnership Execution',
            responsibilities: [
                'Sponsor asset collection',
                'Partner coordination',
                'Placement execution',
                'Sponsor obligations tracking'
            ],
            eventRole: 'Partnership Coordinator',
            dailyDelivery: '5:30 PM daily',
            kpis: [
                'Sponsor logo packs collected (Week 2)',
                'Placement requirements documented',
                'Sponsor visibility plan approved',
                'Partner activation coordination'
            ]
        }
    ];

    // Predefined recurring team meetings
    const recurringMeetings: RecurringMeeting[] = [
        {
            id: 'design-review',
            title: 'Design Review Session',
            description: 'Review design outputs, provide feedback, and approve assets',
            dayOfWeek: 1, // Monday
            time: '14:00',
            duration: 60,
            attendees: ['CEO', 'Head of Design', 'Design Team'],
            meetingLink: 'https://meet.jit.si/exhibot-design-review',
            type: 'weekly'
        },
        {
            id: 'exec-sync',
            title: 'Executive Sync',
            description: 'C-suite alignment on strategy, sponsorships, and key decisions',
            dayOfWeek: 3, // Wednesday
            time: '15:00',
            duration: 45,
            attendees: ['CEO', 'COO', 'CTO', 'CFO'],
            meetingLink: 'https://meet.jit.si/exhibot-exec-sync',
            type: 'weekly'
        },
        {
            id: 'weekly-review',
            title: 'Weekly Progress Review',
            description: 'Full team review of weekly deliverables and next week planning',
            dayOfWeek: 5, // Friday
            time: '16:00',
            duration: 60,
            attendees: ['All Team Members'],
            meetingLink: 'https://meet.jit.si/exhibot-weekly-review',
            type: 'weekly'
        },
        {
            id: 'pm-checkin',
            title: 'PM Daily Check-in',
            description: 'Project Manager consolidates reports and updates timeline',
            dayOfWeek: -1, // Every day
            time: '19:00',
            duration: 30,
            attendees: ['Project Manager', 'Department Leads'],
            meetingLink: 'https://meet.jit.si/exhibot-pm-checkin',
            type: 'daily'
        }
    ];

    const dailySchedule: DailyScheduleItem[] = [
        { time: '9:00 AM', activity: 'All team members online and available', owner: 'Everyone' },
        { time: '10:00 AM', activity: 'Design team standup (5 min)', owner: 'Design Lead' },
        { time: '5:00 PM', activity: 'CEO, CFO, Social Media daily reports due', owner: 'Respective roles' },
        { time: '5:30 PM', activity: 'COO, Event Manager, Partnerships reports due', owner: 'Respective roles' },
        { time: '6:00 PM', activity: 'CTO, Designers daily reports due', owner: 'Respective roles' },
        { time: '6:30 PM', activity: 'Design Lead consolidated report', owner: 'Design Lead' },
        { time: '7:00 PM', activity: 'PM publishes master daily delivery log', owner: 'Project Manager' },
        { time: '8:00 PM', activity: 'CEO reviews all reports and provides feedback', owner: 'CEO' }
    ];

    // Get deliverable status for a specific KPI
    const getDeliverableStatus = (roleIndex: number, kpiIndex: number): DeliverableUpdate | undefined => {
        return deliverableUpdates.find(d => d.roleIndex === roleIndex && d.kpiIndex === kpiIndex);
    };

    // Check if a recurring meeting is happening now
    const isMeetingLive = (meeting: RecurringMeeting): boolean => {
        const now = currentTime;
        const currentDay = now.getDay();
        const [hours, minutes] = meeting.time.split(':').map(Number);

        // Check if it's the right day (-1 means every day)
        if (meeting.dayOfWeek !== -1 && meeting.dayOfWeek !== currentDay) return false;

        const meetingStart = new Date(now);
        meetingStart.setHours(hours, minutes, 0, 0);
        const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);

        return now >= meetingStart && now <= meetingEnd;
    };

    // Check if meeting is starting soon (within 15 minutes)
    const isMeetingStartingSoon = (meeting: RecurringMeeting): boolean => {
        const now = currentTime;
        const currentDay = now.getDay();
        const [hours, minutes] = meeting.time.split(':').map(Number);

        // Check if it's the right day (-1 means every day)
        if (meeting.dayOfWeek !== -1 && meeting.dayOfWeek !== currentDay) return false;

        const meetingStart = new Date(now);
        meetingStart.setHours(hours, minutes, 0, 0);

        const diffMs = meetingStart.getTime() - now.getTime();
        const diffMins = diffMs / 60000;

        return diffMins > 0 && diffMins <= 15;
    };

    // Get any live meetings for announcement
    const getLiveMeetings = (): RecurringMeeting[] => {
        return recurringMeetings.filter(m => isMeetingLive(m));
    };

    // Get meetings starting soon
    const getUpcomingMeetings = (): RecurringMeeting[] => {
        return recurringMeetings.filter(m => isMeetingStartingSoon(m));
    };

    // Get day name
    const getDayName = (day: number): string => {
        if (day === -1) return 'Every Day';
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day];
    };

    // Copy meeting link
    const copyMeetingLink = async (link: string) => {
        await navigator.clipboard.writeText(link);
        alert('Meeting link copied!');
    };

    // Update deliverable status
    const updateDeliverable = (roleIndex: number, kpiIndex: number, status: DeliverableUpdate['status'], notes: string) => {
        const now = new Date().toLocaleString();
        setDeliverableUpdates(prev => {
            const existing = prev.findIndex(d => d.roleIndex === roleIndex && d.kpiIndex === kpiIndex);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { roleIndex, kpiIndex, status, notes, lastUpdated: now };
                return updated;
            }
            return [...prev, { roleIndex, kpiIndex, status, notes, lastUpdated: now }];
        });
    };

    // Generate daily report text for a role
    const generateDailyReport = (roleIndex: number): string => {
        const role = roles[roleIndex];
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const roleDeliverables = deliverableUpdates.filter(d => d.roleIndex === roleIndex);
        const completed = roleDeliverables.filter(d => d.status === 'completed').length;
        const inProgress = roleDeliverables.filter(d => d.status === 'in-progress').length;
        const blocked = roleDeliverables.filter(d => d.status === 'blocked').length;

        return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 EXHIBOT LABS - DAILY PROGRESS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date: ${dateStr}
⏰ Submitted: ${timeStr}
👤 Name: ${role.name}
💼 Role: ${role.title}
🎯 Scope: ${role.scope}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DELIVERABLES SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: ${completed}/${role.kpis.length}
🔄 In Progress: ${inProgress}/${role.kpis.length}
🚫 Blocked: ${blocked}/${role.kpis.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLETED TODAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [Task 1 - describe what you accomplished]
• [Task 2 - include specific outcomes/artifacts]
• [Task 3 - mention any collaborative work]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 IN PROGRESS / TOMORROW'S FOCUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [Priority 1 - what you will work on next]
• [Priority 2 - expected completion date]
• [Priority 3 - any dependencies]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 BLOCKERS / HELP NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [Blocker 1 - describe the issue]
  → Who can help: [Name/Team]
  → Impact if not resolved: [Description]

• [Blocker 2 - if any]
  → Who can help: [Name/Team]
  → Impact if not resolved: [Description]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 KEY DELIVERABLES STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${role.kpis.map((kpi, i) => {
            const status = getDeliverableStatus(roleIndex, i);
            const statusIcon = status?.status === 'completed' ? '✅' : status?.status === 'in-progress' ? '🔄' : status?.status === 'blocked' ? '🚫' : '⬜';
            return `${statusIcon} ${kpi}${status?.notes ? `\n   └─ Notes: ${status.notes}` : ''}`;
        }).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ RISK/ESCALATION (if any)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [Any risks to timeline or deliverables]
• [Items requiring CEO/Leadership attention]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Report submitted by: ${role.name}
🔗 Event Role: ${role.eventRole}
⏰ Due Time: ${role.dailyDelivery}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#ExhibotLabs #DailyReport #${role.title.replace(/\s+/g, '')}`;
    };

    // Copy report to clipboard
    const copyDailyReport = async (roleIndex: number) => {
        const report = generateDailyReport(roleIndex);
        await navigator.clipboard.writeText(report);
        setCopiedReport(roleIndex);
        setTimeout(() => setCopiedReport(null), 2000);
    };

    // Generate deliverables document
    const generateDeliverablesDocument = async () => {
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const sections = roles.map((role, roleIndex) => {
            const roleDeliverables = role.kpis.map((kpi, kpiIndex) => {
                const update = getDeliverableStatus(roleIndex, kpiIndex);
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: update?.status === 'completed' ? '✅ ' : update?.status === 'in-progress' ? '🔄 ' : update?.status === 'blocked' ? '🚫 ' : '⬜ ',
                        }),
                        new TextRun({ text: kpi }),
                        update?.notes ? new TextRun({ text: ` - ${update.notes}`, italics: true, color: "666666" }) : new TextRun({ text: '' }),
                    ],
                    indent: { left: 360 },
                    spacing: { after: 100 },
                });
            });

            return [
                new Paragraph({
                    children: [new TextRun({ text: `${role.title} - ${role.name}`, bold: true, size: 24 })],
                    spacing: { before: 300, after: 100 },
                }),
                ...roleDeliverables,
            ];
        }).flat();

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: "EXHIBOT LABS - DELIVERABLES TRACKER", bold: true, size: 32, color: "0088FF" })],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: `Last Updated: ${currentDate}`, size: 20, color: "666666" })],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    ...sections,
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Exhibot_Deliverables_Tracker_${new Date().toISOString().split('T')[0]}.docx`);
    };

    const generateMemoDocument = async (roleIndex: number) => {
        const role = roles[roleIndex];
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch in twips
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children: [
                    // Header
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "EXHIBOT LABS",
                                bold: true,
                                size: 32,
                                color: "0088FF",
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),

                    // Memo header fields
                    new Paragraph({
                        children: [
                            new TextRun({ text: "TO: ", bold: true }),
                            new TextRun({ text: role.name }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "FROM: ", bold: true }),
                            new TextRun({ text: "Joel, CEO - Exhibot Labs" }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "DATE: ", bold: true }),
                            new TextRun({ text: currentDate }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "RE: ", bold: true }),
                            new TextRun({ text: "Role Confirmation & Deliverables" }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // Divider line
                    new Paragraph({
                        border: {
                            bottom: {
                                color: "666666",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 6,
                            },
                        },
                        spacing: { after: 300 },
                    }),

                    // Dear greeting
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Dear ${role.name},` }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // Intro paragraph
                    new Paragraph({
                        children: [
                            new TextRun({ text: "This memo confirms your role, responsibilities, and performance expectations at Exhibot Labs for the next 6 weeks leading to our flagship event." }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // Your Role section
                    new Paragraph({
                        children: [
                            new TextRun({ text: `YOUR ROLE: ${role.title}`, bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: role.scope, italics: true, color: "0066CC" }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // Daily Reporting section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "DAILY REPORTING:", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Submit daily progress report by ` }),
                            new TextRun({ text: role.dailyDelivery, bold: true, color: "0066CC" }),
                            new TextRun({ text: " with:" }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "1. Tasks completed today" })],
                        indent: { left: 720 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "2. Tomorrow's focus" })],
                        indent: { left: 720 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "3. Blockers or help needed" })],
                        indent: { left: 720 },
                        spacing: { after: 300 },
                    }),

                    // Responsibilities section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "YOUR RESPONSIBILITIES:", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    ...role.responsibilities.map(resp =>
                        new Paragraph({
                            children: [new TextRun({ text: `• ${resp}` })],
                            indent: { left: 360 },
                        })
                    ),
                    new Paragraph({ spacing: { after: 200 } }),

                    // Key Deliverables section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "KEY DELIVERABLES (Next 6 Weeks):", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    ...role.kpis.map(kpi =>
                        new Paragraph({
                            children: [new TextRun({ text: `• ${kpi}` })],
                            indent: { left: 360 },
                        })
                    ),
                    new Paragraph({ spacing: { after: 200 } }),

                    // Event Role section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "EVENT ROLE:", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: role.eventRole })],
                        spacing: { after: 300 },
                    }),

                    // Performance Expectations section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "PERFORMANCE EXPECTATIONS:", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Consistent delivery is critical to our success. Failure to deliver assigned responsibilities for 14 consecutive days will result in role reassignment to ensure event success." }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // Acceptance section
                    new Paragraph({
                        children: [
                            new TextRun({ text: "ACCEPTANCE:", bold: true }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Please reply within 48 hours with written acceptance of this role and its deliverables." }),
                        ],
                        spacing: { after: 400 },
                    }),

                    // Signature lines
                    new Paragraph({
                        children: [new TextRun({ text: "Signature: _________________________________" })],
                        spacing: { after: 300 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Date: _________________________________" })],
                        spacing: { after: 400 },
                    }),

                    // Divider
                    new Paragraph({
                        border: {
                            bottom: {
                                color: "CCCCCC",
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 4,
                            },
                        },
                        spacing: { after: 200 },
                    }),

                    // Footer contact
                    new Paragraph({
                        children: [
                            new TextRun({ text: "For questions or clarifications, contact Joel directly at joel@exhibot.ng", size: 20, color: "666666" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "www.exhibot.ng", size: 20, color: "666666" }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Role_Memo_${role.title.replace(/\s+/g, '_')}_${role.name.replace(/\s+/g, '_')}.docx`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1 md:mb-2">Exhibot Labs</h1>
                            <p className="text-sm md:text-base text-slate-600">Organizational Structure & Execution</p>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">www.exhibot.ng</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="text-xs md:text-sm text-slate-500">Effective Date</div>
                            <div className="text-base md:text-lg font-semibold text-slate-900">{new Date().toLocaleDateString()}</div>
                            <div className="mt-2 px-2 md:px-3 py-1 bg-red-100 text-red-800 rounded text-xs md:text-sm font-bold inline-block">
                                6 WEEKS TO GO
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg mb-4 md:mb-6 p-1.5 md:p-2 grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('orgchart')}
                        className={`py-2 md:py-3 px-2 md:px-4 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 whitespace-nowrap ${activeTab === 'orgchart' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Roles</span>
                        <span className="sm:hidden">Team</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={`py-2 md:py-3 px-2 md:px-4 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 whitespace-nowrap ${activeTab === 'daily' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Daily Schedule</span>
                        <span className="sm:hidden">Daily</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tracker')}
                        className={`py-2 md:py-3 px-2 md:px-4 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 whitespace-nowrap ${activeTab === 'tracker' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <CheckSquare className="w-3 h-3 md:w-4 md:h-4" />
                        Tracker
                    </button>
                    <button
                        onClick={() => setActiveTab('meetings')}
                        className={`py-2 md:py-3 px-2 md:px-4 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 whitespace-nowrap ${activeTab === 'meetings' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <Video className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Meetings</span>
                        <span className="sm:hidden">Meet</span>
                        {getLiveMeetings().length > 0 && (
                            <span className="ml-0.5 px-1 py-0.5 bg-red-500 text-white text-[10px] md:text-xs rounded-full animate-pulse">
                                LIVE
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('memos')}
                        className={`py-2 md:py-3 px-2 md:px-4 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 whitespace-nowrap col-span-2 md:col-span-1 ${activeTab === 'memos' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        <FileText className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Role Memos</span>
                        <span className="sm:hidden">Memos</span>
                    </button>
                </div>

                {activeTab === 'orgchart' && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-6 rounded-lg">
                            <h3 className="font-bold text-red-900 mb-2 text-sm md:text-base">CRITICAL PRINCIPLES</h3>
                            <p className="text-red-800 font-medium mb-1 md:mb-2 text-xs md:text-sm">1. Titles without outputs are invalid.</p>
                            <p className="text-red-800 font-medium mb-1 md:mb-2 text-xs md:text-sm">2. CEO owns ALL marketing inputs.</p>
                            <p className="text-red-800 font-medium mb-1 md:mb-2 text-xs md:text-sm">3. Design team executes only - no strategy.</p>
                            <p className="text-red-700 text-xs mt-2">
                                Failure to deliver for 14 consecutive days = role reassignment.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {roles.map((role, idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-lg p-4 md:p-6 border-t-4 border-blue-600">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                                        <p className="text-sm text-slate-600">{role.name}</p>
                                        <p className="text-xs text-blue-600 font-medium mt-1">{role.scope}</p>
                                        <a href={`mailto:${role.email}`} className="text-xs text-slate-500 hover:text-blue-600 mt-1 block truncate">
                                            📧 {role.email}
                                        </a>
                                    </div>

                                    <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                                        <p className="text-xs font-semibold text-yellow-900">Daily Report:</p>
                                        <p className="text-sm font-bold text-yellow-800">{role.dailyDelivery}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Responsibilities:</h4>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            {role.responsibilities.map((resp, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-blue-600 mr-2">•</span>
                                                    <span>{resp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mb-4 p-3 bg-slate-50 rounded">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Event Role:</h4>
                                        <p className="text-sm text-slate-900 font-medium">{role.eventRole}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Deliverables:</h4>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            {role.kpis.map((kpi, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <span>{kpi}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'daily' && (
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Daily Delivery Schedule</h2>

                        <div className="mb-4 md:mb-6 bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4">
                            <p className="text-xs md:text-sm text-blue-900 font-semibold">
                                Every team member must submit a daily report by their assigned time.
                            </p>
                            <p className="text-xs md:text-sm text-blue-800 mt-1 md:mt-2">
                                Click &quot;Copy Report Template&quot; below to get a pre-filled template!
                            </p>
                        </div>

                        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                            {dailySchedule.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-1 md:gap-2">
                                    <div className="w-20 md:w-24 font-bold text-blue-600 shrink-0 text-sm md:text-base">{item.time}</div>
                                    <div className="flex-1 text-slate-900 text-sm md:text-base">{item.activity}</div>
                                    <div className="text-xs md:text-sm text-slate-600 italic">{item.owner}</div>
                                </div>
                            ))}
                        </div>

                        {/* One-Click Copy Reports Section */}
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
                                <Copy className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                                One-Click Daily Report Templates
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                                Select your role and click to copy a detailed, pre-filled daily report template.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roles.map((role, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-green-400 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{role.title}</h4>
                                                <p className="text-xs text-slate-500">{role.name}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
                                                {role.dailyDelivery.split(' ')[0]}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => copyDailyReport(idx)}
                                            className={`w-full mt-2 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${copiedReport === idx
                                                ? 'bg-green-600 text-white'
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                }`}
                                        >
                                            {copiedReport === idx ? (
                                                <>
                                                    <ClipboardCheck className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy Report Template
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="font-bold text-green-900 mb-3">Daily Report Format</h3>
                                <div className="text-sm text-green-800 space-y-2">
                                    <p><strong>📅 Date & Time:</strong> Auto-filled</p>
                                    <p><strong>👤 Name & Role:</strong> Auto-filled</p>
                                    <p><strong>📊 Deliverables Summary:</strong> From tracker</p>
                                    <p className="pt-2"><strong>✅ Completed Today:</strong></p>
                                    <p className="pl-4">• Tasks with specific outcomes</p>
                                    <p><strong>🔄 Tomorrow&apos;s Focus:</strong></p>
                                    <p className="pl-4">• Priorities with expected dates</p>
                                    <p><strong>🚫 Blockers:</strong></p>
                                    <p className="pl-4">• Issues + who can help + impact</p>
                                    <p><strong>⚠️ Risks:</strong></p>
                                    <p className="pl-4">• Timeline or deliverable concerns</p>
                                </div>
                            </div>

                            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                                <h3 className="font-bold text-red-900 mb-3">Missed Report Consequences</h3>
                                <ul className="text-sm text-red-800 space-y-2">
                                    <li>- 1st miss: Verbal warning</li>
                                    <li>- 2nd miss: Written warning + CEO escalation</li>
                                    <li>- 3rd miss: Performance tracker documentation</li>
                                    <li>- 5+ misses: Non-performance review</li>
                                    <li className="pt-2 font-bold">Consecutive misses count toward 14-day rule</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Deliverable Tracker Tab */}
                {activeTab === 'tracker' && (
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Deliverable Tracker</h2>
                            <button
                                onClick={generateDeliverablesDocument}
                                className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                            >
                                <Download className="w-4 h-4" />
                                Download Tracker
                            </button>
                        </div>

                        <div className="mb-4 md:mb-6 bg-green-50 border-l-4 border-green-500 p-3 md:p-4">
                            <p className="text-xs md:text-sm text-green-900 font-semibold">
                                Track deliverables for each role. Updates are reflected in daily reports.
                            </p>
                        </div>

                        {/* Downloadable Deliverables Documents */}
                        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                Deliverables Documents
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                                Download the official deliverables breakdown and overview guides.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a
                                    href="/deliverables/Other Departments Deliverables Breakdown Timeline.pdf"
                                    download
                                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                        <FileText className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">Breakdown Timeline</p>
                                        <p className="text-xs text-slate-500">Deliverables timeline for all departments</p>
                                    </div>
                                    <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </a>

                                <a
                                    href="/deliverables/Other Departments Deliverables Overview Guide (1).pdf"
                                    download
                                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">Overview Guide</p>
                                        <p className="text-xs text-slate-500">Complete deliverables overview for teams</p>
                                    </div>
                                    <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </a>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Role to Track:
                            </label>
                            <select
                                value={selectedTrackerRole ?? ''}
                                onChange={(e) => setSelectedTrackerRole(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">-- Choose a role --</option>
                                {roles.map((role, idx) => (
                                    <option key={idx} value={idx}>
                                        {role.title} - {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTrackerRole !== null && (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h3 className="font-bold text-slate-900 text-lg">{roles[selectedTrackerRole].title}</h3>
                                    <p className="text-sm text-slate-600">{roles[selectedTrackerRole].name} - {roles[selectedTrackerRole].scope}</p>
                                </div>

                                <div className="space-y-3">
                                    {roles[selectedTrackerRole].kpis.map((kpi, kpiIdx) => {
                                        const update = getDeliverableStatus(selectedTrackerRole, kpiIdx);
                                        return (
                                            <div key={kpiIdx} className="p-4 bg-white border border-slate-200 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-900 mb-2">{kpi}</p>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {(['not-started', 'in-progress', 'completed', 'blocked'] as const).map(status => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => updateDeliverable(selectedTrackerRole, kpiIdx, status, update?.notes || '')}
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${update?.status === status
                                                                        ? status === 'completed' ? 'bg-green-600 text-white'
                                                                            : status === 'in-progress' ? 'bg-yellow-500 text-white'
                                                                                : status === 'blocked' ? 'bg-red-600 text-white'
                                                                                    : 'bg-slate-600 text-white'
                                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                        }`}
                                                                >
                                                                    {status === 'not-started' ? '⬜ Not Started' :
                                                                        status === 'in-progress' ? '🔄 In Progress' :
                                                                            status === 'completed' ? '✅ Completed' :
                                                                                '🚫 Blocked'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Add notes..."
                                                            value={update?.notes || ''}
                                                            onChange={(e) => updateDeliverable(selectedTrackerRole, kpiIdx, update?.status || 'not-started', e.target.value)}
                                                            className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                        {update?.lastUpdated && (
                                                            <p className="text-xs text-slate-400 mt-1">Last updated: {update.lastUpdated}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary for selected role */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-bold text-blue-900 mb-2">Summary for {roles[selectedTrackerRole].title}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div className="p-3 bg-white rounded-lg">
                                            <p className="text-2xl font-bold text-slate-600">
                                                {roles[selectedTrackerRole].kpis.length - deliverableUpdates.filter(d => d.roleIndex === selectedTrackerRole).length}
                                            </p>
                                            <p className="text-xs text-slate-500">Not Started</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg">
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {deliverableUpdates.filter(d => d.roleIndex === selectedTrackerRole && d.status === 'in-progress').length}
                                            </p>
                                            <p className="text-xs text-slate-500">In Progress</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">
                                                {deliverableUpdates.filter(d => d.roleIndex === selectedTrackerRole && d.status === 'completed').length}
                                            </p>
                                            <p className="text-xs text-slate-500">Completed</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg">
                                            <p className="text-2xl font-bold text-red-600">
                                                {deliverableUpdates.filter(d => d.roleIndex === selectedTrackerRole && d.status === 'blocked').length}
                                            </p>
                                            <p className="text-xs text-slate-500">Blocked</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedTrackerRole === null && (
                            <div className="text-center py-12 text-slate-500">
                                <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Select a role above to track their deliverables</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Meetings Tab */}
                {activeTab === 'meetings' && (
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Team Meetings Structure</h2>

                        {/* Live Meeting Announcement Banner */}
                        {getLiveMeetings().length > 0 && (
                            <div className="mb-6 p-4 md:p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg animate-pulse">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-ping" />
                                        <div>
                                            <p className="font-bold text-lg md:text-xl">🔴 MEETING IN PROGRESS</p>
                                            <p className="text-green-100">{getLiveMeetings()[0].title}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={getLiveMeetings()[0].meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 flex items-center gap-2 transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Join Now
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Starting Soon Banner */}
                        {getUpcomingMeetings().length > 0 && getLiveMeetings().length === 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                        <div>
                                            <p className="font-bold text-yellow-800">⏰ Starting Soon!</p>
                                            <p className="text-yellow-700">{getUpcomingMeetings()[0].title} - in less than 15 minutes</p>
                                        </div>
                                    </div>
                                    <a
                                        href={getUpcomingMeetings()[0].meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Get Ready
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="mb-4 md:mb-6 bg-purple-50 border-l-4 border-purple-500 p-3 md:p-4">
                            <p className="text-xs md:text-sm text-purple-900 font-semibold">
                                All team meetings are recurring. Jitsi Meet links are permanent and always available.
                            </p>
                        </div>

                        {/* Meeting Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recurringMeetings.map(meeting => {
                                const isLive = isMeetingLive(meeting);
                                const isSoon = isMeetingStartingSoon(meeting);

                                return (
                                    <div
                                        key={meeting.id}
                                        className={`p-4 md:p-5 rounded-xl border-2 transition-all ${isLive
                                            ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-300'
                                            : isSoon
                                                ? 'border-yellow-400 bg-yellow-50'
                                                : 'border-slate-200 bg-white hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{meeting.title}</h3>
                                                    {isLive && (
                                                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full animate-pulse">
                                                            LIVE
                                                        </span>
                                                    )}
                                                    {isSoon && !isLive && (
                                                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                                                            Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs md:text-sm text-slate-500 mt-1">{meeting.description}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${meeting.type === 'daily' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                {meeting.type === 'daily' ? 'Daily' : 'Weekly'}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs md:text-sm text-slate-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span>{getDayName(meeting.dayOfWeek)} at {meeting.time} ({meeting.duration} mins)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                <span>{meeting.attendees.join(', ')}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {(isLive || isSoon) && (
                                                <a
                                                    href={meeting.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                                                    Join
                                                </a>
                                            )}
                                            <button
                                                onClick={() => copyMeetingLink(meeting.meetingLink)}
                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs md:text-sm hover:bg-slate-200 flex items-center gap-1"
                                            >
                                                <Copy className="w-3 h-3 md:w-4 md:h-4" />
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Meeting Guidelines */}
                        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-50 rounded-lg">
                            <h3 className="font-bold text-slate-900 mb-3 text-sm md:text-base">Meeting Guidelines</h3>
                            <ul className="text-xs md:text-sm text-slate-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Join meetings on time - meetings start promptly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Prepare updates before standup meetings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Keep cameras on when possible for engagement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Share meeting recording links in team chat if you miss a session</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'memos' && (
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6 print:hidden">Role Acceptance Memo Generator</h2>

                        <div className="mb-4 md:mb-6 print:hidden">
                            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                                Select Role to Generate Memo:
                            </label>
                            <select
                                value={selectedRole ?? ''}
                                onChange={(e) => setSelectedRole(e.target.value ? parseInt(e.target.value) : null)}
                                className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Choose a role --</option>
                                {roles.map((role, idx) => (
                                    <option key={idx} value={idx}>
                                        {role.title} - {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedRole !== null && (
                            <>
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg print:hidden">
                                    <p className="text-sm text-green-900">
                                        ✓ Memo generated for <strong>{roles[selectedRole].title}</strong> - {roles[selectedRole].name}
                                    </p>
                                </div>

                                <div
                                    id="printable-memo"
                                    className="memo-container bg-white relative mx-auto border border-slate-200 rounded-lg overflow-hidden"
                                    style={{
                                        maxWidth: '8.5in',
                                        minHeight: '11in',
                                        backgroundImage: 'url(/letterhead.png)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    {/* Memo Content - positioned to avoid letterhead header/footer */}
                                    <div
                                        className="text-sm space-y-3"
                                        style={{
                                            fontFamily: 'Arial, sans-serif',
                                            lineHeight: '1.5',
                                            padding: '120px 60px 100px 60px'
                                        }}
                                    >
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">TO:</p>
                                                <p className="text-slate-900">{roles[selectedRole].name}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">DATE:</p>
                                                <p className="text-slate-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">FROM:</p>
                                                <p className="text-slate-900">Joel, CEO - Exhibot Labs</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">RE:</p>
                                                <p className="text-slate-900">Role Confirmation & Deliverables</p>
                                            </div>
                                        </div>

                                        <div className="border-t-2 border-slate-300 pt-3 space-y-3">
                                            <p>Dear {roles[selectedRole].name},</p>

                                            <p>This memo confirms your role, responsibilities, and performance expectations at Exhibot Labs for the next 6 weeks leading to our flagship event.</p>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">YOUR ROLE: {roles[selectedRole].title}</p>
                                                <p className="text-blue-700 italic">{roles[selectedRole].scope}</p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">DAILY REPORTING:</p>
                                                <p>Submit daily progress report by <strong className="text-blue-700">{roles[selectedRole].dailyDelivery}</strong> with:</p>
                                                <ol className="list-decimal ml-6 mt-1">
                                                    <li>Tasks completed today</li>
                                                    <li>Tomorrow&apos;s focus</li>
                                                    <li>Blockers or help needed</li>
                                                </ol>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">YOUR RESPONSIBILITIES:</p>
                                                <ul className="list-disc ml-6">
                                                    {roles[selectedRole].responsibilities.map((resp, i) => (
                                                        <li key={i}>{resp}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">KEY DELIVERABLES (Next 6 Weeks):</p>
                                                <ul className="list-disc ml-6">
                                                    {roles[selectedRole].kpis.map((kpi, i) => (
                                                        <li key={i}>{kpi}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">EVENT ROLE:</p>
                                                <p>{roles[selectedRole].eventRole}</p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">PERFORMANCE EXPECTATIONS:</p>
                                                <p>Consistent delivery is critical to our success. Failure to deliver assigned responsibilities for 14 consecutive days will result in role reassignment to ensure event success.</p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 mb-1">ACCEPTANCE:</p>
                                                <p>Please reply within 48 hours with written acceptance of this role and its deliverables.</p>
                                            </div>

                                            <div className="mt-6 pt-3">
                                                <p className="mb-6">Signature: _________________________________</p>
                                                <p>Date: _________________________________</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-4 print:hidden">
                                    <button
                                        onClick={() => {
                                            const memo = document.getElementById('printable-memo');
                                            if (memo) {
                                                const text = memo.innerText;
                                                navigator.clipboard.writeText(text);
                                                alert('Memo copied to clipboard!');
                                            }
                                        }}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        📋 Copy Memo Text
                                    </button>

                                    <button
                                        onClick={() => generateMemoDocument(selectedRole)}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download as Word
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 print:hidden">
                                    <p className="text-sm text-blue-900">
                                        <strong>Next Steps:</strong> Download the memo as a Word document, print and get it signed by {roles[selectedRole].name}, or copy and send via email/WhatsApp. Store signed copies in company records.
                                    </p>
                                </div>
                            </>
                        )}

                        {selectedRole === null && (
                            <div className="text-center py-12 text-slate-500 print:hidden">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Select a role above to generate their personalized memo</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center text-sm text-slate-600">
                    <p className="font-semibold">Exhibot Labs - www.exhibot.ng</p>
                    <p className="mt-1">Internal company document - For team use only</p>
                </div>
            </div>
        </div>
    );
};

export default ExhibotOrgStructure;
