import styles from './pagination.module.css'

const Product = ({ data }) => {
    return (
        <div className={`${styles["product"]}`}>
            <a href="#">
                <img src={data.thumbnail} alt={data.title} height={"200px"} width={"250px"} />
                <p>{data.title}</p>
            </a>
        </div>
    )
}

export default Product