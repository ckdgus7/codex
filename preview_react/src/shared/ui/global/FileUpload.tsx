import { useState, useRef, useCallback } from "react";

interface UploadedFile {
  id: string;
  name: string;
}

interface FileUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  multiple?: boolean;
  accept?: string;
  dragText?: string;
  buttonText?: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V17" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11 2H5C4.44772 2 4 2.44772 4 3V17C4 17.5523 4.44772 18 5 18H15C15.5523 18 16 17.5523 16 17V7L11 2Z" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 2V7H16" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4L12 12" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FileUpload({ value, onChange, multiple = true, accept, dragText = "파일을 드래그하거나 클릭하여 업로드해주세요.", buttonText = "파일 선택" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: f.name }));
    onChange([...value, ...newFiles]);
  }, [value, onChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    addFiles(selectedFiles);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes("Files")) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  return (
    <div>
      <input ref={fileInputRef} type="file" multiple={multiple} accept={accept} className="hidden" onChange={handleFileChange} />
      <div
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#d4d4d8] px-4 py-6 transition-colors duration-150",
          isDragging && "border-[#7a5af8] bg-[#fafaff]"
        )}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon />
        <span className="text-center font-sans text-[13px] leading-[18px] text-[#a1a1aa]">{dragText}</span>
        <button
          className="rounded-md border border-[#7a5af8] bg-none px-4 py-1.5 font-sans text-[13px] font-medium leading-[18px] text-[#7a5af8]"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {buttonText}
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          {value.map((file) => (
            <div key={file.id} className="flex items-center gap-2 rounded-md bg-[#fafafa] px-2 py-1.5">
              <FileIcon />
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] leading-[18px] text-[#18181b]">{file.name}</span>
              <button className="flex shrink-0 items-center justify-center border-none bg-none p-0.5" onClick={() => handleDelete(file.id)} aria-label="삭제">
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
