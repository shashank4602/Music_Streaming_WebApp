const PasswordInput = ({ label, placeholder, value, setValue }) => {
    return (
        <div className="textInputDiv flex flex-col space-y-2 w-full">
            <label for={label} className="font-semibold">
                {label}
            </label>
            <input type="text"
                placeholder="Password"
                className="p-3 border border-gray-400 border-solid rounded placeholder-gray-500"
                id={label}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
        </div>
    )
}
export default PasswordInput;