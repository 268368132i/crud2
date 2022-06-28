
export const listRenderers = {
    main: (collPerm) => {
        return (
            <>
                {`Collection: ${collPerm.collection}`}
            </>
        )
    },
    description: (collPerm) => {
        return (
            <div
                style={{
                    'display': 'grid',
                    'gridTemplateColumns': '1fr 1fr',
                    'gridTemplateRows': '1fr'
                }}
            >
                <p>All: {collPerm.all?.read && 'read'}{collPerm.all?.modify && '&modify'}</p>
                <p>{collPerm.group
                        ? `Group: ${collPerm.group._id} ${collPerm.group.read && 'read'}${collPerm.group.modify && '&modify'}`
                        : 'No group'
                    }</p>

            </div>
        )
    }
}