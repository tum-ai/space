"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Plus } from "lucide-react";
import { ApplicationField } from "@components/application/applicationField";
import { getTallyFields, type SelectingProps } from "./tally-form";
import { type Application } from "@prisma/client";

export const ApplicationForm = ({
  application,
  selecting: selecting,
  setSelecting,
  selectFun,
}: {
  application: Application;
} & SelectingProps) => {
  return (
    <Card className="h-full overflow-y-scroll">
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Application Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sticky grid gap-8">
          {getTallyFields(application)?.map((field) => {
            const select = selectFun.current;

            return (
              <div key={field.key} className="flex min-h-10 items-end gap-2">
                <AnimatePresence>
                  {!!selecting &&
                    selecting.types.includes(field.type) &&
                    select && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "initial" }}
                        exit={{ opacity: 0, width: 0 }}
                      >
                        <Button
                          onClick={() => {
                            select(field);

                            if (!selecting.multiple) {
                              setSelecting(undefined);
                            }
                          }}
                          size="icon"
                          variant="outline"
                        >
                          <Plus />
                        </Button>
                      </motion.div>
                    )}
                </AnimatePresence>

                <ApplicationField field={field} className="w-full" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
