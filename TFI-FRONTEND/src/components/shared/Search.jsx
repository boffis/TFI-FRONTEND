const Search = ({
    entity = '',
    type = 'text',
    value,
    onChange
}) => {
    return (
        <div className="mb-5 w-1/4">
            <label htmlFor="search" className="block mb-1 text-sm font-medium">
                Buscar {entity}:
            </label>
            <input
                id="search"
                type={type}
                placeholder={`Buscar ${entity}...`}
                onChange={onChange}
                value={value}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    )
}

export default Search