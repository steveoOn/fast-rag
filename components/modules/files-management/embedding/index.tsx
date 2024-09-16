import { Button } from '@/components/ui/button';
import useFilesManagementStore from '../store';

export default function Embedding() {
  const { embed } = useFilesManagementStore();

  return <Button onClick={embed}>Embedding</Button>;
}
