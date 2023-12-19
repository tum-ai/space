"use client"
import Dialog from "@components/Dialog";
import {DialogClose} from "@radix-ui/react-dialog";
import {Cross1Icon} from "@radix-ui/react-icons";
import {Field, Form, Formik} from "formik";
import Input from "@components/Input";
import {Button} from "@components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select"

export default function FormDialog(props:any){
    return <div>
        <Dialog trigger={<Button>Button</Button>}>
            <DialogClose className="float-right">
                <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
            </DialogClose>
            <div className="flex flex-col">
                <h1 className="text-2xl">Edit question</h1>
                <p className="text-slate-400">Questions will be asked to the {props.target} after the step.</p>
                <Formik initialValues={null} onSubmit={props.onSubmit}>
                    <Form className="flex flex-col gap-3 mt-8">
                        <span className="flex items-center gap-5">
                            <p className="w-20">Name</p>
                            <Field
                                as={Input}
                                type="name"
                                name="name"
                                placeholder="Name"
                                state={true}
                                className="w-52"
                            />
                        </span>
                        <span className="flex items-center gap-5 ">
                            <p className="w-20">Question</p>
                            <Field
                                as={Input}
                                type="question"
                                name="question"
                                placeholder="Question"
                                state={true}
                                className="w-52"
                            />
                        </span>
                        <span className="flex items-center gap-5">
                            <p className="w-20">Type</p>
                            <Select>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Select a type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="binary">Binary</SelectItem>
                                      <SelectItem value="multiple">Multiple</SelectItem>
                                      <SelectItem value="slider">Slider</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </span>
                        <span className="flex gap-4 mt-8">
                            <Button type="submit" variant="outline">Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </span>
                    </Form>
                </Formik>
            </div>
        </Dialog>
    </div>
}