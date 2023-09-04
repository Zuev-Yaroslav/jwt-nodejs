import userResource from "./userResource.js";

class PostResource {
    collection(collection) {
        var newArray = []
        collection.forEach((value, index) => {
            const {_id, title, text, images, user, createdAt} = value
            newArray[index] = {
                id: _id,
                title, text, images, createdAt, user: userResource.make(user[0])
            }
        });
        return newArray;
    }
    make(object) {
        const {_id, title, text, images, user, createdAt} = object
        return {
            id: _id,
            title, text, images, createdAt, user: userResource.make(user[0])
        }
    }
}
export default new PostResource()