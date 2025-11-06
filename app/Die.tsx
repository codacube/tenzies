import React from "react";

interface DieStyles {
  backgroundColor: string;
}

interface DieProps {
  value: number;
  isHeld: boolean;
  holdDice: React.MouseEventHandler<HTMLDivElement>;
}

export default function Die(props: DieProps): React.ReactElement {
  const styles: DieStyles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };
  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      <h2 className="die-num">{props.value}</h2>
    </div>
  );
}
