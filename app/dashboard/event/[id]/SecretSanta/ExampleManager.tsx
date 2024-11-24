'use client';

import { useState, useEffect } from 'react';
// import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


interface FamilyMember {
  id: string;
  name: string;
}

interface Exclusion {
  giver: string;
  excluded: string;
}

export function SecretSantaManager() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [assignments, setAssignments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // In a real application, you would fetch family members based on the activeFamilyId
    // For now, we'll use mock data
    setFamilyMembers([
      { id: '1', name: 'Mom' },
      { id: '2', name: 'Dad' },
      { id: '3', name: 'Sister' },
      { id: '4', name: 'Brother' },
      { id: '5', name: 'Grandma' },
    ]);
  }, []);

  const toggleParticipant = (memberId: string) => {
    setParticipants(prev => (prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]));
  };

  const toggleExclusion = (giver: string, excluded: string) => {
    setExclusions(prev => {
      const existingExclusion = prev.find(e => e.giver === giver && e.excluded === excluded);
      if (existingExclusion) {
        return prev.filter(e => e !== existingExclusion);
      } else {
        return [...prev, { giver, excluded }];
      }
    });
  };

  const generateAssignments = () => {
    const availableRecipients = [...participants];
    const newAssignments: { [key: string]: string } = {};

    for (const giver of participants) {
      const possibleRecipients = availableRecipients.filter(
        recipient => recipient !== giver && !exclusions.some(e => e.giver === giver && e.excluded === recipient)
      );

      if (possibleRecipients.length === 0) {
        alert('Unable to generate assignments. Please check exclusions and try again.');
        return;
      }

      const recipientIndex = Math.floor(Math.random() * possibleRecipients.length);
      const recipient = possibleRecipients[recipientIndex];

      newAssignments[giver] = recipient;
      availableRecipients.splice(availableRecipients.indexOf(recipient), 1);
    }

    setAssignments(newAssignments);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Secret Santa Manager</CardTitle>
          <CardDescription>Select participants and set exclusions for Secret Santa</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Select Participants</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {familyMembers.map(member => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`participant-${member.id}`}
                  checked={participants.includes(member.id)}
                  onCheckedChange={() => toggleParticipant(member.id)}
                />
                <Label htmlFor={`participant-${member.id}`}>{member.name}</Label>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-2">Set Exclusions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giver</TableHead>
                {familyMembers.map(member => (
                  <TableHead key={member.id}>{member.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map(giver => (
                <TableRow key={giver.id}>
                  <TableCell>{giver.name}</TableCell>
                  {familyMembers.map(recipient => (
                    <TableCell key={recipient.id}>
                      {giver.id !== recipient.id && (
                        <Checkbox
                          checked={exclusions.some(e => e.giver === giver.id && e.excluded === recipient.id)}
                          onCheckedChange={() => toggleExclusion(giver.id, recipient.id)}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={generateAssignments}>Generate Assignments</Button>
        </CardFooter>
      </Card>
      {Object.keys(assignments).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Secret Santa Assignments</CardTitle>
            <CardDescription>Here are the generated Secret Santa assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giver</TableHead>
                  <TableHead>Recipient</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(assignments).map(([giverId, recipientId]) => (
                  <TableRow key={giverId}>
                    <TableCell>{familyMembers.find(m => m.id === giverId)?.name}</TableCell>
                    <TableCell>{familyMembers.find(m => m.id === recipientId)?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
