import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Modal from '../ui/Modal';

export const PipelineNamingModal = ({ isOpen, onClose, onConfirm, initialValue = '' }) => {
    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            name: initialValue
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset({ name: initialValue });
        } else {
            reset({ name: '' });
        }
    }, [isOpen, initialValue, reset]);

    const onSubmit = (data) => {
        onConfirm(data.name.trim());
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 shadow-neon-primary">
                    <RocketLaunchIcon className="w-8 h-8 text-violet-400" />
                </div>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-white tracking-tight">Name Your Pipeline</h3>
                    <p className="text-slate-400 text-sm mt-1">Give your workflow a memorable title</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                    <Input
                        autoFocus
                        placeholder="e.g. Smart Support Agent"
                        error={errors.name?.message}
                        {...register("name", { 
                            required: "Pipeline name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" },
                            maxLength: { value: 30, message: "Name is too long (max 30)" }
                        })}
                    />

                    <div className="flex gap-3">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            className="flex-1 py-4 !rounded-2xl" 
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="pill"
                            className="flex-1 py-4 !rounded-2xl shadow-neon-primary"
                        >
                            Save Flow
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
