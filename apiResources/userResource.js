class UserResource {
    collection(collection) {
        var newArray = []
        collection.forEach((value, index) => {
            const {_id, username, email, roles, image, emailVerifiedAt, createdAt} = value
            newArray[index] = {
                id: _id,
                username, email, roles, image, emailVerifiedAt, createdAt
            }
        });
        return newArray;
    }
    make(object) {
        const {_id, username, email, roles, image, emailVerifiedAt, createdAt} = object
        return {
            id: _id,
            username, email, roles, image, emailVerifiedAt, createdAt
        }
    }
}
export default new UserResource()