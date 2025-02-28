import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export interface JsonFieldProps {
  label: string
  value: any
  onChange: (value: any) => void
}

export function JsonField({ label, value, onChange }: JsonFieldProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setText(JSON.stringify(value, null, 2))
  }, [value]);

  const handleOnChange = (event: any) => {
    const text = event.target.value
    setText(text)
    try {
      const value = JSON.parse(text)
      setError(false)
      onChange?.(value)
    } catch (e) {
      setError(true)
    }
  }

  return <TextField
    label={label}
    multiline
    value={text}
    onChange={handleOnChange}
    minRows={5}
    maxRows={10}
    error={error}
    helperText={error ? "Invalid json" : null}
  />
}