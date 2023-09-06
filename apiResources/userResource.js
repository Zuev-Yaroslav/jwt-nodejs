class UserResource {
    collection(collection) {
        var newArray = []
        collection.forEach((value, index) => {
            const {_id, username, email, roles, image, createdAt} = value
            newArray[index] = {
                id: _id,
                username, email, roles, image, createdAt
            }
        });
        return newArray;
    }
    make(object) {
        const {_id, username, email, roles, image, createdAt} = object
        return {
            id: _id,
            username, email, roles, image, createdAt
        }
    }
}
export default new UserResource()