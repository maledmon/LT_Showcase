"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  
  const [data, setData] = useState<{products: any[], limit: number, skip: number, total: number}|null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [resultsPerPage, setResultsPerPage] = useState<number>(10)
  const [numberOfPages, setNumberOfPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [searchKey, setSearchKey] = useState<string>("")

  useEffect(() => {
    window.scrollTo(0, 0)
    let skip = (pageNumber-1)*resultsPerPage
    let url = "https://dummyjson.com/products?limit="+resultsPerPage+"&skip="+skip
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data)
        setNumberOfPages(Math.ceil(data.total/data.limit))
        setLoading(false)
      })
  }, [resultsPerPage, pageNumber])

  let changePageNumber = (pageNumberClicked: number) =>{
    setPageNumber(pageNumberClicked);
  }
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No Data</p>
  
  return (
    <main>
      <label htmlFor="resultsPerPage">Results Per Page: </label>
      <select id="resultsPerPage" className={styles.resultsDropDown} value={resultsPerPage} onChange={(resultsPP) => {setPageNumber(1); setResultsPerPage(parseInt(resultsPP.target.value));}}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <Row xs={2} md={3} className="g-4">
      {data.products.map((i, idx) => 
        <Col key={idx}>
          <Card className="flex-fill" key={i.id} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={i.thumbnail} width="100%" />
            <Card.Body>
              <Card.Title>{i.title}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      )}
      </Row>

      <div className={styles.paginationDiv}>
        {[...Array(numberOfPages)].map((x,i) =>
          <span onClick={() => changePageNumber(i+1)} key={"page_"+i+1} className={styles.paginationPages+ " " + (pageNumber == i+1 ? styles.activePage : '')}>{i+1}</span>  
        )}
      </div>
        
    </main>
  );
}
