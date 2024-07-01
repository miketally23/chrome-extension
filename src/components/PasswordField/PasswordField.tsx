import { TextField, styled } from "@mui/material";
import { useState } from 'react'

export const CustomInput = styled(TextField)({
    width: "183px", // Adjust the width as needed
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


export const PasswordField = ({ ...props }) => {
    const [canViewPassword, setCanViewPassword] = useState(false);
    return (
        <div style={{
            position: 'relative'
        }}>
            <CustomInput
                type={canViewPassword ? 'text' : 'password'}
                id="standard-adornment-password"
                {...props}
            />
            <button type='button' style={{
                position: 'absolute',
                right: 0,
                top: '50%'
            }} onClick={() => {
                setCanViewPassword((prevState) => !prevState)
            }}>{canViewPassword ? '🙀' : '😸'}</button>
        </div>
    )
}