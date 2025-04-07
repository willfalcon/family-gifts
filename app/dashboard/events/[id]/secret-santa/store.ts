import { EventFromGetEvent } from '@/lib/queries/events';
import { User } from '@prisma/client';
import { create } from 'zustand';

export type Exclusion = {
  from: User;
  to: User;
};

export type Assignment = {
  giver: User;
  recipient: User;
};

type SecretSantaState = {
  budget: string;
  participants: User[];
  exclusions: Exclusion[];
  assignments: Assignment[];
  showAssignments: boolean;

  initializeStore: (event: EventFromGetEvent) => void;
  setBudget: (budget: string) => void;
  addParticipant: (participant: User) => void;
  removeParticipant: (participant: User) => void;
  setParticipants: (participants: User[]) => void;

  addExclusion: (from: User, to: User) => void;
  removeExclusion: (from: User, to: User) => void;
  hasExclusion: (from: User, to: User) => boolean;

  generateAssignments: () => void;
  resetAssignments: () => void;
  setShowAssignments: (show: boolean) => void;
};

export const useSecretSantaStore = create<SecretSantaState>((set, get) => ({
  budget: '',
  participants: [],
  exclusions: [],
  assignments: [],
  showAssignments: false,

  initializeStore: (event: EventFromGetEvent) => {
    const participants = event.assignments.reduce((acc: User[], assignment) => {
      if (assignment.giver && !acc.some((p) => p.id === assignment.giver?.id)) {
        acc.push(assignment.giver);
      }
      if (assignment.recipient && !acc.some((p) => p.id === assignment.recipient?.id)) {
        acc.push(assignment.recipient);
      }
      return acc;
    }, []);

    set({
      budget: event.secretSantaBudget || '',
      participants,
      exclusions: event.exclusions.map((exclusion) => ({
        from: exclusion.from,
        to: exclusion.to,
      })),
      assignments: event.assignments.map((assignment) => ({
        giver: assignment.giver,
        recipient: assignment.recipient,
      })),
    });
  },

  setBudget: (budget: string) => set({ budget }),
  addParticipant: (participant: User) => set((state) => ({ participants: [...state.participants, participant] })),
  removeParticipant: (participant: User) => set((state) => ({ participants: state.participants.filter((p) => p.id !== participant.id) })),
  setParticipants: (participants: User[]) => set({ participants }),
  addExclusion: (from: User, to: User) => {
    const { exclusions } = get();
    // Check if exclusion already exists
    if (!exclusions.some((e) => e.from.id === from.id && e.to.id === to.id)) {
      set({ exclusions: [...exclusions, { from, to }] });
    }
  },
  removeExclusion: (from: User, to: User) => {
    const { exclusions } = get();
    set({ exclusions: exclusions.filter((e) => e.from.id !== from.id && e.to.id !== to.id) });
  },
  hasExclusion: (from: User, to: User) => {
    const { exclusions } = get();
    return exclusions.some((e) => e.from.id === from.id && e.to.id === to.id);
  },
  generateAssignments: () => {
    const { participants, hasExclusion } = get();

    const givers = [...participants];
    const recipients = [...participants];
    const newAssignments: Assignment[] = [];

    // Shuffle receivers
    for (let i = recipients.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [recipients[i], recipients[j]] = [recipients[j], recipients[i]];
    }

    // Assign givers to receivers
    for (let i = 0; i < givers.length; i++) {
      const giver = givers[i];

      // Find a valid receiver (not the same person and respects exclusions)
      let recipientIndex = -1;
      for (let j = 0; j < recipients.length; j++) {
        if (recipients[j] !== giver && !hasExclusion(giver, recipients[j]) && !newAssignments.some((a) => a.recipient.id === recipients[j].id)) {
          recipientIndex = j;
          break;
        }
      }

      if (recipientIndex >= 0) {
        newAssignments.push({
          giver,
          recipient: recipients[recipientIndex],
        });
        recipients.splice(recipientIndex, 1);
      }
    }

    // If we couldn't assign everyone, alert the user
    if (newAssignments.length < participants.length) {
      alert("Couldn't generate valid assignments with the current exclusions. Please try again or modify exclusions.");
      return;
    }

    set({
      assignments: newAssignments,
      showAssignments: true,
    });
  },
  resetAssignments: () => set({ assignments: [], showAssignments: false }),
  setShowAssignments: (show: boolean) => set({ showAssignments: show }),
}));
