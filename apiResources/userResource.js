class UserResource {
    collection(collection) {
        var newArray = []
        collection.forEach((value, index) => {
            const {_id, username, email, password, roles, image, createdAt} = value
            newArray[index] = {
                id: _id,
                username, email, password, roles, image, createdAt
            }
        });
        return newArray;
    }
    make(object) {
        const {_id, username, email, password, roles, image, createdAt} = object
        return {
            id: _id,
            username, email, password, roles, image, createdAt
        }
    }
}
export default new UserResource()