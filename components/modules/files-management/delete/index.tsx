'use client';
import { Button } from '@/components/ui/button';
import useFilesManagementStore from '../store';

export default function Delete() {
  const { deleteFiles } = useFilesManagementStore();
  return (
    <Button variant="destructive" onClick={deleteFiles}>
      Delete
    </Button>
  );
}
