import { CardTitle} from 'react-bootstrap';
// import PageTitle from '@/components/PageTitle';
// import { LiaEdit } from 'react-icons/lia';
import { useMemo, useState } from 'react';
import CustomQuill from "@/components/CustomQuill.tsx";

interface SnowEditorProps {
    title?: string;
    value?: string;
    onChange?: (value: string) => void;
}

const SnowEditor = ({ value, onChange }: SnowEditorProps) => {
    const modules = useMemo(
        () => ({
            toolbar: [
                [{ font: [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'super' }, { script: 'sub' }],
                [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['link', 'image', 'video'],
                ['clean'],
            ],
        }),
        [],
    );
    
    const [internalValue, setInternalValue] = useState<string>('');

    const handleChange = (newValue: string) => {
        if (onChange) {
            onChange(newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    return (
        <>
            <CardTitle className="fs-6 mb-1">
            </CardTitle>
            <CustomQuill 
                key="snow" 
                theme="snow" 
                modules={modules} 
                value={value || internalValue} 
                onChange={handleChange}
            />
        </>
    );
};

export default SnowEditor;
