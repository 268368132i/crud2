
export const listRenderers = {
    main: (user) => {
        return (
            <>
                {`${user.firstName} ${user.lastName}`}
            </>
        )
    },
    description: (user) => {
        return (
            <>
                <p>
                    Login: {user.username}
                </p>
            </>
        )
    }
}