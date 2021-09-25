const { User, Thought } = require('../models')


const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select:"-__v",
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: "thoughts",
            select:"-__v",
        })
        .select('-__v')
        .then ((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createUser({ body }, res) {
        User.create(body)
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => {
              console.log(err)
              res.status(400).json(err)
          });
      },
      updateUser({ params, body }, res) {
          User.findOneAndUpdate({_id: params.id }, body, {new: true})
          .then((dbUserData) => {
              if (!dbUserData) {
                res.status(404).json({ message: "No user found with this ID"});
                return;
              }
              res.json(dbUserData);
          })
          .catch((err) => res.status(400).json(err));
      },
      deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "no user found with this ID" });
              return;
            }
            User.updateMany(
                { _id: { $in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            )
            .then (() => {
                Thought.deleteMany({ username: dbUserData.username })
                .then(() => {
                    res.json({ message: "Successfully deleted user" });
                })
                .catch((err) => res.status(400).json(err));
            })
            .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json(err));
      },
      addFriend ({ params }, res) {
          User.findOneAndUpdate({ _id: params.id }, { $push: { friends: params.friendId } }, { new: true })
        //   .populate({path: 'friends', select: ('-__v')})
          .select('-__v')
         .then(dbUserData => {
             if (!dbUserData) {
                 res.status(404).json({ message: 'No User with this ID.' })
                 return;
             }
             res.json(dbUserData)
         })
         .catch((err) => res.status(404).json(err)); 
      },
      deleteFriend({ params }, res) {
        Users.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
        // .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = usersController; 