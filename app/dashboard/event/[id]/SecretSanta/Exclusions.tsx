import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FamilyMember } from '@prisma/client';
import { useSecretSantaStore } from './SecretSantaStoreProvider';

export interface Exclusion {
  giver: FamilyMember;
  excluded: FamilyMember;
}

// type ExclusionsProps = {
//   participating: FamilyMember[];
//   exclusions: Exclusion[];
//   setExclusions: Dispatch<SetStateAction<Exclusion[]>>;
// };

export default function Exclusions() {
  const exclusions = useSecretSantaStore((state) => state.exclusions);
  const participating = useSecretSantaStore((state) => state.participating);
  const toggleExclusion = useSecretSantaStore((state) => state.toggleExclusion);
  
  return (
    <>
      <h3 className="text-lg font-semibold">Set Exclusions</h3>
      <p className="text-sm text-muted-foreground mb-2">Uncheck boxes to make sure someone doesn&apos;t get the wrong person.</p>
      {!!participating.length && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Giver</TableHead>
              {participating.map((member) => (
                <TableHead key={member.id}>{member.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {participating.map((giver) => (
              <TableRow key={giver.id}>
                <TableCell>{giver.name}</TableCell>
                {participating.map((recipient) => (
                  <TableCell key={recipient.id}>
                    {giver.id !== recipient.id && (
                      <Checkbox
                        checked={!exclusions.some((e) => e.giver.id === giver.id && e.excluded.id === recipient.id)}
                        onCheckedChange={() => toggleExclusion(giver, recipient)}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
