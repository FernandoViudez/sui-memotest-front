export const CreateRoom = () => {
  return (
    <article className="h-100 d-flex">
      <div className="form  text-white d-flex flex-column w-75 m-auto">
        <div className="mb-3">
          <div className="form-label">Room Name</div>
          <input className="form-control" type="text" />
        </div>
        <div className="mb-5">
          <div className="form-label">Room Password</div>
          <input className="form-control" type="text" />
        </div>
        <button className="btn w-50 m-auto btn-primary" type="submit">
          Create Room
        </button>
      </div>
    </article>
  );
};
