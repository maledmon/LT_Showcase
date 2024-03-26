"use client"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react'
import { DialogContent, Rating, IconButton, DialogTitle, Dialog, InputAdornment,
  Grid, Box, Input, Typography, CardMedia, CardContent, Card, Container, Toolbar,
  AppBar, CssBaseline, Pagination, Stack, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { Slide } from "react-slideshow-image";
import { SelectChangeEvent } from '@mui/material/Select';
import 'react-slideshow-image/dist/styles.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

type ProductInfoType = {
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

type DataType = {
  products: ProductInfoType[], 
  limit: number, 
  skip: number, 
  total: number
}

export default function Home() {
  const [data, setData] = useState<DataType|null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [resultsPerPage, setResultsPerPage] = useState<string>("10")
  const [numberOfPages, setNumberOfPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [searchKey, setSearchKey] = useState<string>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [itemInfo, setItemInfo] = useState<ProductInfoType|null>(null)
  const [modalShow, setModalShow] = useState(false);

  const handleModalClose = () => setModalShow(false);
  
  const handleModalShow = (id: number) => {
    fetch("https://dummyjson.com/products/"+id.toString())
      .then((res) => res.json())
      .then(async (data) => {
        setItemInfo(data);
        setModalShow(true);
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    let skip = (pageNumber-1)*parseInt(resultsPerPage)
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
        setNumberOfPages(Math.ceil(data.total/data.limit))
        setLoading(false)
      })
  }, [resultsPerPage, pageNumber, searchKey])

  const changePageNumber = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  const search = () => {
      setSearchKey(searchInput)
  }

  const searchEnter = (e: any) => {
    if (e.key === 'Enter') {
      setSearchKey(searchInput)
    }
  }

  const handleResultsPerPage = (event: SelectChangeEvent) => {
    setPageNumber(1); 
    setResultsPerPage(event.target.value);
  }
 
  if (isLoading) return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme/>
      <Box sx={{ width:"100%", textAlign: "center" }}>
        <strong>Loading...</strong>
      </Box>
    </ThemeProvider>
)
  if (!data) return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme/>
      <strong>No Data</strong>
    </ThemeProvider>
  )
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme/>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{marginBottom:"15px"}}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Matt LT-Showcase
            </Typography>

            <FormControl sx={{ m: 1, width: '12ch' }} variant="standard">
              <InputLabel id="results-per-page-select-label">Results Per Page</InputLabel>
              <Select
                labelId="results-per-page-select-label"
                id="results-per-page-select"
                value={resultsPerPage}
                label="Age"
                onChange={handleResultsPerPage}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
              <InputLabel htmlFor="search-input">Search</InputLabel>
              <Input
                id="search-input"
                type='text'
                value={searchInput} 
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={searchEnter}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search"
                      onClick={search}
                      edge="end"
                    >
                      <Search/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Toolbar>
        </AppBar>
        <Container fixed maxWidth="lg">
          <Grid container spacing={2}>
          {data.products.map((i, idx) => 
            <Grid item md={6} lg={3} key={idx}>
              <Card onClick={() => handleModalShow(i.id)} className="flex-fill" key={i.id} style={{ width: '18rem' }}>
                <CardMedia image={i.thumbnail} sx={{height:140}}/>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">{i.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          </Grid>

          <Box display="flex" alignItems="center" justifyContent="center">
            <Stack spacing={2}>
              <Pagination count={numberOfPages} page={pageNumber} onChange={changePageNumber} />
            </Stack>
          </Box>

          {itemInfo != null ? 
            <Dialog open={modalShow} onClose={handleModalClose}>
              <DialogTitle sx={{ m: 0, p: 2 }}>{itemInfo.title}</DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleModalClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close/>
              </IconButton>

              <DialogContent>
                <Slide>
                  {itemInfo.images.map((item, index) => 
                    <div key={"image_"+itemInfo.id+"_"+index} className="each-slide-effect">
                      <img src={item}></img>
                    </div>
                  )}
                </Slide>
                <Typography>{itemInfo.description}</Typography>
                <Typography>Price: <s style={{color: "red"}}>${itemInfo.price.toFixed(2)}</s> &nbsp; ${(itemInfo.price - (itemInfo.price*(itemInfo.discountPercentage/100))).toFixed(2)}</Typography>
                <Typography sx={{display:"flex", alignItems:"center"}}>
                  Rating: <Rating name="read-only" value={itemInfo.rating} precision={0.1} readOnly />
                </Typography>
                <Typography sx={{fontWeight:"bold"}}><b>Only {itemInfo.stock} left in stock!</b></Typography>
              </DialogContent>
            </Dialog>
          : ""}
            
        </Container>
      </Box>
    </ThemeProvider>
  );
}
