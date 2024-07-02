import { InputAdornment, TextField, TextFieldProps, styled } from "@mui/material";
import { useState } from 'react'

export const CustomInput = styled(TextField)({
    width: "100%", // Adjust the width as needed
    maxWidth: "183px",
    borderRadius: "5px",
    // backgroundColor: "rgba(30, 30, 32, 1)",
    outline: "none",
    input: {
        fontSize: 10,
        fontFamily: "Inter",
        fontWeight: 400,
        color: "white",
        "&::placeholder": {
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.2)",
        },
        outline: "none",
        padding: "10px",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: '0.5px solid rgba(255, 255, 255, 0.5)',
        },
        "&:hover fieldset": {
            border: '0.5px solid rgba(255, 255, 255, 0.5)',
        },
        "&.Mui-focused fieldset": {
            border: '0.5px solid rgba(255, 255, 255, 0.5)',
        },
    },
    "& .MuiInput-underline:before": {
        borderBottom: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
        borderBottom: "none",
    },
});


export const PasswordField: React.FunctionComponent<TextFieldProps> = ({ ...props }) => {
    const [canViewPassword, setCanViewPassword] = useState(false);
    return (
            <CustomInput
                type={canViewPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" style={{
                            cursor: 'pointer'
                        }} onClick={() => {
                            setCanViewPassword((prevState) => !prevState)
                        }}>
                            {canViewPassword ? <span data-testid="eyes-opened">🙀</span> : <span data-testid="eyes-closed">😸</span>}
                        </InputAdornment>
                    )
                }}
                {...props}
            />
    )
}