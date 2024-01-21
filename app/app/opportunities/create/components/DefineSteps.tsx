import DefinePhases from "./DefinePhases";

const phases = {
	"Screening phase": ["Screening"],
	"Interview phase": ["Venture Interview", "RnD Interview", "Legal Interview"],
	Decision: ["Venture Decision", "RnD Decision", "Legal Decision"],
  };

export default function DefineSteps() {
  return (
	  <DefinePhases phases={phases}/>
  );
}
