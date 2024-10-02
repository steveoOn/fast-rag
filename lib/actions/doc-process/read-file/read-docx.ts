import mammoth from 'mammoth';

export default function readDocx(content: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    mammoth
      .extractRawText({ buffer: content })
      .then((result) => {
        console.log(result.value, '********');
        resolve(result.value);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}
