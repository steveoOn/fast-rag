import Embedding from '@/components/modules/embedding';
import Uploader from '@/components/modules/uploader';

export default function Chat() {
  return (
    <main>
      <div className="flex flex-col gap-4">
        <Uploader />
        <Embedding />
      </div>
    </main>
  );
}
