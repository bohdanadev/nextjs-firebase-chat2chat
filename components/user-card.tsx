import React, { FC } from "react";

interface IProps {
  name: string;
  avatarUrl: string | null;
  latestMessage: string;
  type: string;
}

const UserCard: FC<IProps> = ({ avatarUrl, name, latestMessage, type }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer">
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={avatarUrl}
            alt="Avatar"
          />
        </div>
      </div>

      {type === "chat" && (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
          <p className="text-gray-500 truncate">{latestMessage}</p>
        </div>
      )}

      {type == "users" && (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
