import './Filter.css'
function Filter()
{
return(
    <div className="filter-container">
        <button className="btn active">All</button>
        <button className="btn">Active</button>
        <button className="btn">Completed</button>
    </div>
)

}
export default Filter;