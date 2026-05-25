import React, { useState } from "react";
import { ProgressBar } from "react-native-paper";

interface Props {
  progress: number;
  color: string;
}

const CProgressBar = ({ progress, color }: Props) => {
  return <ProgressBar progress={progress} color={color} />;
};

export default CProgressBar;
