import { AssignmentWithRefs, EventWithAssignments } from '@/prisma/types';
import { FamilyMember } from '@prisma/client';
import { toast } from 'sonner';
import { createStore } from 'zustand/vanilla';

export type AssignmentsType = {
  giver: FamilyMember;
  receiver: FamilyMember;
};
export type Exclusion = {
  giver: FamilyMember;
  excluded: FamilyMember;
};
export type SecretSantaState = {
  participating: FamilyMember[];
  exclusions: Exclusion[];
  assignments: AssignmentsType[];
  generated: boolean;
  eventId: string;
  saved: boolean;
};

export type SecretSantaActions = {
  toggleParticipant: (member: FamilyMember) => void;
  toggleExclusion: (giver: FamilyMember, excluded: FamilyMember) => void;
  generateAssignments: () => void;
  setGenerated: (generated: boolean) => void;
  setSaved: (saved: boolean) => void;
};

export type SecretSantaStore = SecretSantaState & SecretSantaActions;

// export const initSecretSantaStore = (): SecretSantaState => {
//   return {
//     participating: [],
//     exclusions: [],
//     assignments: [],
//     generated: false,
//     saved: false,
//     eventId: '',
//   };
// };

// export const defaultInitState = {
//   participating: [],
//   exclusions: [],
//   assignments: [],
//   generated: false,
//   eventId: ''
// };

function generateAssignments(participating: FamilyMember[], exclusions: { giver: FamilyMember; excluded: FamilyMember }[]): AssignmentsType[] {
  // Validate input
  if (participating.length < 2) return [];

  // Create exclusion map for faster lookup
  const exclusionMap = new Map<string, Set<string>>();
  exclusions.forEach(({ giver, excluded }) => {
    if (!exclusionMap.has(giver.id)) {
      exclusionMap.set(giver.id, new Set());
    }
    exclusionMap.get(giver.id)!.add(excluded.id);
  });

  // Backtracking function to find valid assignments
  function findAssignments(givers: FamilyMember[], receivers: FamilyMember[], currentAssignments: AssignmentsType[] = []): AssignmentsType[] | null {
    // Base case: all givers assigned
    if (givers.length === 0) return currentAssignments;

    // Try assigning the first giver
    const currentGiver = givers[0];

    for (let i = 0; i < receivers.length; i++) {
      const potentialReceiver = receivers[i];

      // Check assignment validity
      const isValidAssignment = currentGiver.id !== potentialReceiver.id && !(exclusionMap.get(currentGiver.id)?.has(potentialReceiver.id) || false);

      if (isValidAssignment) {
        // Create new arrays removing current receiver
        const newReceivers = [...receivers.slice(0, i), ...receivers.slice(i + 1)];
        const newGivers = givers.slice(1);
        const newAssignments = [...currentAssignments, { giver: currentGiver, receiver: potentialReceiver }];

        // Recursive call
        const result = findAssignments(newGivers, newReceivers, newAssignments);
        if (result) return result;
      }
    }

    // No valid assignment found
    return null;
  }

  // Shuffle participants to increase randomness
  const shuffledParticipating = [...participating].sort(() => Math.random() - 0.5);

  // Attempt to find assignments
  const assignments = findAssignments(shuffledParticipating, shuffledParticipating);

  if (!assignments) {
    throw new Error('No valid assignment combination exists');
  }

  return assignments;
}

export const createSecretSantaStore = (event: EventWithAssignments) => {
  const defaultParticipating =
    event.assignments?.reduce((acc: FamilyMember[], cur: AssignmentWithRefs): FamilyMember[] => {
      const toAdd = [];
      if (!acc.find((a) => a.id === cur.giver.id)) {
        toAdd.push(cur.giver);
      }
      if (!acc.find((a) => a.id === cur.receiver.id)) {
        toAdd.push(cur.receiver);
      }
      return [...acc, ...toAdd];
    }, []) || [];

  const assignments = event.assignments || [];

  return createStore<SecretSantaStore>()((set) => ({
    participating: defaultParticipating,
    exclusions: [],
    assignments,
    generated: false,
    saved: false,
    eventId: event.id,
    setGenerated: (generated: boolean) => set({ generated }),
    setSaved: (saved: boolean) => set({ saved }),
    generateAssignments: () => {
      set((state) => {
        try {
          const newAssignments = generateAssignments(state.participating, state.exclusions);
          return { assignments: newAssignments, generated: true };
        } catch (error) {
          console.error(error);
          toast.error('Unable to generate assignments. Check exclusions and participants.');
          return { assignments: [] };
        }
      });
    },
    toggleParticipant: (member: FamilyMember) => {
      set((state) => {
        const p = state.participating;
        const isIncluded = p.find((includedMember) => includedMember.id === member.id);
        const newState = isIncluded ? p.filter((removedMember) => removedMember.id !== member.id) : [...p, member];
        return { participating: newState };
      });
    },
    toggleExclusion: (giver: FamilyMember, excluded: FamilyMember) => {
      set((state) => {
        const prev = state.exclusions;
        const existingExclusion = prev.findIndex((e) => e.giver.id === giver.id && e.excluded.id === excluded.id);
        if (existingExclusion >= 0) {
          return { exclusions: [...prev.slice(0, existingExclusion), ...prev.slice(existingExclusion + 1)] };
        } else {
          return { exclusions: [...prev, { giver, excluded }] };
        }
      });
    },
  }));
};
