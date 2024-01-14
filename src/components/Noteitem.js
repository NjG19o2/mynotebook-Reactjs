import React, { useContext }  from 'react'
import noteContext from "../context/notes/noteContext";

function Noteitem(props) {
  const { note,updateNote } = props;
  const context =useContext(noteContext);
  const {deleteNote}=context;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">
            {note.description}
          </p>
          <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
          <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted successfully", "success")}}></i>
        </div>
      </div>
    </div>
  );
}

export default Noteitem;
