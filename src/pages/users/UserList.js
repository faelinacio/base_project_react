import React, {useEffect, useState} from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  withStyles
} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import UserService from "../../services/UserService";
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 40,
  },
  head: {
    fontWeight: "bolder",
    backgroundColor: "#3e3e3e",
  },
  row: {
    fontWeight: "lighter",
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const UserList = () => {
  const classes = useStyles();
  const notify = (text) => toast.warn(text, {});
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    UserService.getUsers(rowsPerPage, page + 1)
      .then((res) => {
        setUsers(res.data.users)
        setTotal(res.data.total);
      })
      .catch((err) => {
        notify(err);
      });
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <Container className={classes.container}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead >
            <TableRow>
              <TableCell className={classes.head}>Id</TableCell>
              <TableCell className={classes.head}>Name</TableCell>
              <TableCell className={classes.head}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user =>
              <StyledTableRow key={user.id}>
              <TableCell className={classes.row}>{user.id}</TableCell>
              <TableCell className={classes.row}>{user.name}</TableCell>
              <TableCell className={classes.row}>{user.email}</TableCell>
            </StyledTableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                component="td"
                count={total}
                page={page}
                onChangePage={handleChangePage}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default UserList