export type ___FTName___Props = {
  // prop types here
  className?: string;
};

export type Use___FTName___Props = {
  // prop types here
  text?: string;
};

export default function use___FTName___({
  text = '___FTName___ hovered',
}: Use___FTName___Props = {}) {
  const handleHover = () => {
    console.log(text);
  };

  return {
    handleHover,
  };
}
