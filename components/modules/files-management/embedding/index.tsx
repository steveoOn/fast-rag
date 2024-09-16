'use client';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function Embedding() {
  return (
    <Button
      onClick={async () => {
        const res = await axios.post('/api/v1/doc-process/embedding', {
          files: ['1', '2'],
        });
        console.log(res);
      }}
    >
      file chunks
    </Button>
  );
}
