export type MyButtonProps = {
  // prop types here
  className?: string;
};

export type UseMyButtonProps = {
  // prop types here
  text?: string;
};

export default function useMyButton({
  text = 'MyButton hovered',
}: UseMyButtonProps = {}) {
  const handleHover = () => {
    console.log(text);
  };

  return {
    handleHover,
  };
}
