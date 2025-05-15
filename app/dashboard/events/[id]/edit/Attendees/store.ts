import { create } from 'zustand';

import { EventFromGetEvent } from '@/lib/queries/events';
import { FormEvent } from 'react';

type AttendeesStore = {
  selectedParticipants: string[];
  setSelectedParticipants: (selectedParticipants: string[]) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  family: string;
  setFamily: (family: string) => void;
  toggleParticipant: (participantId: string) => void;
  externalInvites: string[];
  setExternalInvites: (externalInvites: string[]) => void;
  newInviteEmail: string;
  setNewInviteEmail: (newInviteEmail: string) => void;
  addExternalInvite: (e: FormEvent) => void;
  removeExternalInvite: (email: string) => void;
  initialize: (event: EventFromGetEvent) => void;
};

const useAttendeesStore = create<AttendeesStore>((set, get) => ({
  selectedParticipants: [],
  setSelectedParticipants: (selectedParticipants) => set({ selectedParticipants }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  family: 'none',
  setFamily: (family) => set({ family }),
  toggleParticipant: (participantId: string) => {
    const { selectedParticipants, setSelectedParticipants } = get();
    if (selectedParticipants.includes(participantId)) {
      const updatedParticipants = selectedParticipants.filter((id) => id !== participantId);
      setSelectedParticipants(updatedParticipants);
    } else {
      const updatedParticipants = [...selectedParticipants, participantId];
      setSelectedParticipants(updatedParticipants);
    }
  },
  // families: [],
  // familiesLoading: true,
  // setFamilies: (families) => set({ families, familiesLoading: false }),

  externalInvites: [],
  setExternalInvites: (externalInvites) => set({ externalInvites }),
  newInviteEmail: '',
  setNewInviteEmail: (newInviteEmail) => set({ newInviteEmail }),
  addExternalInvite: (e: FormEvent) => {},
  removeExternalInvite: (email: string) => {},
  initialize: (event: EventFromGetEvent) => {
    set({
      family: event.familyId ?? 'none',
      selectedParticipants: event.attendees.map((attendee) => attendee.id),
    });
  },
}));

export default useAttendeesStore;
