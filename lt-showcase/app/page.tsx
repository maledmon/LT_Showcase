"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Rating from '@mui/material/Rating'
import { Slide } from "react-slideshow-image";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-slideshow-image/dist/styles.css'

type ItemInfoType = {
  id: 1,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string[]
}

export default function Home() {
  
  const [data, setData] = useState<{products: any[], limit: number, skip: number, total: number}|null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [resultsPerPage, setResultsPerPage] = useState<number>(10)
  const [numberOfPages, setNumberOfPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [searchKey, setSearchKey] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [itemInfo, setItemInfo] = useState<ItemInfoType|null>(null)

  const [modalShow, setModalShow] = useState(false);

  const handleModalClose = () => setModalShow(false);
  
  const handleModalShow = (id: number) => {
    fetch("https://dummyjson.com/products/"+id.toString())
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data)
        setItemInfo(data);
        setModalShow(true);
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    let skip = (pageNumber-1)*resultsPerPage
    let url
    if (searchKey == ""){
       url = "https://dummyjson.com/products?limit="+resultsPerPage+"&skip="+skip
    }
    else{
      url = "https://dummyjson.com/products/search?q="+searchKey+"&limit="+resultsPerPage+"&skip="+skip
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data)
        setNumberOfPages(Math.ceil(data.total/data.limit))
        setLoading(false)
      })
  }, [resultsPerPage, pageNumber, searchKey])

  let changePageNumber = (pageNumberClicked: number) => {
    setPageNumber(pageNumberClicked);
  }

  let search = () => {
    setSearchKey(searchInput)
  }
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No Data</p>
  
  return (
    <main>
      <div className={styles.topBarDiv}>
        <div>
          <label htmlFor="resultsPerPage">Results Per Page: </label>
          <select id="resultsPerPage" className={styles.resultsDropDown} value={resultsPerPage} onChange={(resultsPP) => {setPageNumber(1); setResultsPerPage(parseInt(resultsPP.target.value));}}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
        <div>Matt LT Showcase</div>
        <div><input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search"></input> <button onClick={search}>GO</button></div>
      </div>
      <Row xs={2} md={3} className="g-4">
      {data.products.map((i, idx) => 
        <Col key={idx}>
          <Card onClick={() => handleModalShow(i.id)} className="flex-fill" key={i.id} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={i.thumbnail} width="100%" />
            <Card.Body>
              <Card.Title>{i.title}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      )}
      </Row>

      <div className={styles.paginationDiv}>
        {numberOfPages > 0 ?[...Array(numberOfPages)].map((x,i) =>
          <span onClick={() => changePageNumber(i+1)} key={"page_"+i+1} className={styles.paginationPages+ " " + (pageNumber == i+1 ? styles.activePage : '')}>{i+1}</span>  
        ): ""}
      </div>

      {itemInfo != null ? 
        <Modal show={modalShow} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{itemInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Slide>
              {itemInfo.images.map((item, index) => 
                <div key={"image_"+itemInfo.id+"_"+index} className="each-slide-effect">
                  <img src={item}></img>
                </div>
              )}
            </Slide>
            {itemInfo.description}<br/>
            <span>Price: <s style={{color: "red"}}><span style={{color:"black"}}>${itemInfo.price.toFixed(2)}</span></s> &nbsp; ${(itemInfo.price - (itemInfo.price*(itemInfo.discountPercentage/100))).toFixed(2)}</span><br/>
            <div style={{display:"flex", alignItems:"center"}}>
              <span>Rating: </span><Rating name="read-only" value={itemInfo.rating} precision={0.1} readOnly />
            </div>
            <br/>
            <span><b>Only {itemInfo.stock} left in stock!</b></span>
          </Modal.Body>
        </Modal>
      : ""}
        
    </main>
  );
}
