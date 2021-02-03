import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import "./product.css";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, price, site, feedback, point) {
  return { name, price, site, feedback, point };
}

function feedback(value) {
    switch(value) {
      case 'Positive':
        return (
            <TableCell className="overall-feedback" style={{color:'#27AE61'}} align="right">{value}</TableCell>
        )
      case 'Negative':
        return (
            <TableCell className="overall-feedback" style={{color:'#E84C3D'}} align="right">{value}</TableCell>
        )
        case 'Neutral':
            return (
                <TableCell className="overall-feedback" style={{color: '#F1C40F'}} align="right">{value}</TableCell>
            )
    }
  }

const rows = [
  createData("Frozen yoghurt", 159, "Shopee", "Positive", 4.0),
  createData("Ice cream sandwich", 237, "Shopee", "Negative", 4.3),
  createData("Eclair", 262, "Amazon", "Positive", 6.0),
  createData("Cupcake", 305, "Tiki", "Neutral", 4.3),
  createData("Gingerbread", 356, "Sendo", "Negative", 3.9),
];

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Athiti"].join(","),
  },
});

export default function Product(props) {
  return (
    <ThemeProvider theme={theme}>
      <TableContainer className="table-container" component={Paper}>
        <Table id="product-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="table-head">Product</TableCell>
              <TableCell className="table-head" align="right">
                Price
              </TableCell>
              <TableCell className="table-head" align="right">
                Site
              </TableCell>
              <TableCell className="table-head" align="right">
                Feedback
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="product-cell" component="th" scope="row">
                  <div>
                    <img
                      className="product-image"
                      src="https://exacdn.acfc.com.vn/media/catalog/product/cache/1590496433db240c9566f569680d296c/b/c/bc65c_cn18754670.jpg"
                    />
                  </div>
                  <div>
                    <p className="product-name">{row.name}</p>
                  </div>
                </TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.site}</TableCell>
                {feedback(row.feedback)}                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
