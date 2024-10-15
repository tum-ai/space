import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SelectQuestionnaireCombobox } from "./select-questionnaire-combobox";
import { type SelectingProps } from "./tally-form";
import { type TallyField } from "@lib/types/tally";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

const AssignmentRule = ({
  selectFun,
  selecting,
  setSelecting,
}: SelectingProps) => {
  const [questionnaire, setQuestionnaire] = useState("");
  const [field, setField] = useState<TallyField>();

  return (
    <Card className="space-y-2 p-2">
      <div className="flex items-center gap-2 text-sm">
        Assign
        <SelectQuestionnaireCombobox
          value={questionnaire}
          setValue={setQuestionnaire}
        />
        if
        <Button
          variant="outline"
          onClick={() => {
            selectFun.current = (field) => setField(field);
            setSelecting({
              types: ["DROPDOWN", "CHECKBOXES", "MULTIPLE_CHOICE"],
              intent: "rules",
              multiple: false,
            });
          }}
        >
          {!!field?.label ? field?.label : "select field"}
        </Button>
        <AnimatePresence>
          {!!field && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              is
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose application" />
                </SelectTrigger>
                <SelectContent>
                  {"options" in field
                    ? field.options?.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.text}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button variant="outline">Create</Button>
      </div>
    </Card>
  );
};

export const AssignmentForm = ({
  fields,
  ...props
}: {
  fields?: TallyField[];
} & SelectingProps) => {
  const [addRuleOpen, setAddRuleOpen] = useState(false);

  return (
    <Card className="flex flex-1 flex-col gap-2 overflow-y-scroll">
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Assignment rules
        </CardTitle>
        <CardDescription>
          Set rules to determine which questionnaires are assigned to an
          application. Questionnaires without specific rules will be assigned to
          all applicants.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <AnimatePresence>
          {addRuleOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "initial", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <AssignmentRule {...props} />
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="outline"
          onClick={() => setAddRuleOpen(true)}
          className="h-32 w-full items-center justify-center border-dashed"
        >
          <Plus className="mr-2" />
          Add questionnaire rule
        </Button>
      </CardContent>
    </Card>
  );
};
