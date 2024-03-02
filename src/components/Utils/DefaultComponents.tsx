import React from "react";
import {FormProvider, UseFormReturn, useFormContext} from "react-hook-form";


interface FormProps{
    children: React.ReactNode
    className?: string
    methods: UseFormReturn<any>
    onSubmit: (data: any) => void
}

interface InputProps{
    label?: string,
    type?: string,
    classInput?: string,
    classLabel?: string,
    placeholder?: string,
    name: string,
    errors?: any
}

interface SubmitButtonProps{
    children: React.ReactNode,
    className?: string
    onClick?: () => void
}



export function Form({children, onSubmit, className, methods}: FormProps){
    return <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
            {children}
        </form>
    </FormProvider>
}


export function Input({label, type, name, classInput, classLabel, placeholder}: InputProps) {
    const {register, formState: {errors}} = useFormContext<any>();

    return <div>
        {label && <label className={classLabel || ""}>{label}</label>}
        <input className={classInput || ""}
            type={type} {...register(name)} placeholder={placeholder}
        />
        {/*@ts-ignore*/}
        {errors?.[name]?.message && <p className="text-red-500 text-xs italic">
            {/*@ts-ignore*/}
            {errors?.[name]?.message}
        </p>}
    </div>
}

export function SubmitButton({children, className, onClick}: SubmitButtonProps) {
    return <button type="submit" onClick={onClick}
                   className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline " + className}>
        {children}
    </button>
}


export function TextArea({label, name, classInput, classLabel, placeholder}: InputProps) {
    const {register, formState: {errors}} = useFormContext();
    return <div>
        {label && <label className={classLabel || ""}>{label}</label>}
        <textarea className={classInput || ""}
                  {...register(name)} placeholder={placeholder}
        />
        {errors?.[name]?.message && <p className="text-red-500 text-xs italic">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {errors?.[name]?.message}
        </p>}
    </div>
}