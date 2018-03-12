import React from 'react';
import ReactDOM from 'react-dom';
import Actions from './actions.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vacancies: []
        }
    }
    render() {
        return <div className="content-container">
                <Actions updateVacancies={this}/>
                { this.renderVacancies() }
                <span>Средняя по view{this.state.avg_view}</span>
                <span>Средняя по таблице{this.state.avg}</span>
            </div>
    }
    updateVacancies(vacancies) {
        document.querySelector('.loader').classList.add('hidden');
        this.setState({
            vacancies: vacancies,
        });
    }
    afterColumnFilter(filterConds, result) {
        if (result.length == 0)
            return;

        let avg = 0, tmp;
        tmp = JSON.parse(JSON.stringify(result));

        avg = Helper.getAverageSumm(tmp);

        if (avg !== 0 && this.scope.state.avg !== avg) {
            this.scope.setState({
                avg: avg
            });
        }

        if (!this.scope.refs.table)
            return;

        let avg_view = 0,
            currPage = this.scope.refs.table.state.currPage,
            perPage = this.scope.refs.table.state.sizePerPage;

        tmp.splice(currPage * perPage, result.length - currPage * perPage);
        avg_view = Helper.getAverageSumm(tmp)

        if (avg_view !== 0 && this.scope.state.avg_view !== avg_view) {
            this.scope.setState({
                avg_view: avg_view
            });
        }
    }
    renderVacancies() {
        const vacancies = this.state.vacancies;
        const options = {
            afterColumnFilter: this.afterColumnFilter,
            scope: this
        };


        console.log(this.refs.table);
        return <div style={{margin: '5px 10px'}}>
            <BootstrapTable ref="table"
                data={vacancies}
                options={options}
                pagination={true}
                printable
                exportCSV={true}>
                <TableHeaderColumn row='0' colSpan='4' dataSort csvHeader='Описание' headerAlign='center'>Описание</TableHeaderColumn>
                <TableHeaderColumn row='1'
                    width='35'
                    dataField="id"
                    isKey
                    dataSort>ID</TableHeaderColumn>
                <TableHeaderColumn
                    row='1'
                    dataField="title"
                    filter={ { type: 'TextFilter', delay: 1000 } }
                    dataSort>
                    Название
                </TableHeaderColumn>
                <TableHeaderColumn
                    row='1'
                    dataField="location"
                    filter={ { type: 'TextFilter', delay: 1000 } }
                    dataSort>
                    Расположение
                </TableHeaderColumn>
                <TableHeaderColumn
                    row='1'
                    dataField="description"
                    filter={ { type: 'TextFilter', delay: 1000 } }
                    dataSort>Место</TableHeaderColumn>
                <TableHeaderColumn row='0' colSpan='3' dataSort csvHeader='Оплата' headerAlign='center'>Оплата</TableHeaderColumn>
                <TableHeaderColumn row='1' width='200' dataField="min"
                    filter={ {
                    type: 'NumberFilter',
                    delay: 1000,
                    numberComparators: [ '>', '<=' ],
                    defaultValue: { number: 0, comparator: '>' }
                  } }
                    dataSort>Зарплата мин</TableHeaderColumn>
                <TableHeaderColumn row='1' width='200' dataField="max"
                    filter={ {
                        type: 'NumberFilter',
                        delay: 1000,
                        numberComparators: [ '>', '<=' ],
                        defaultValue: { number: 0, comparator: '>' }
                      } }
                      dataSort>Зарплата макс</TableHeaderColumn>
                  <TableHeaderColumn row='1' width='200' dataField="avg"
                filter={ {
                        type: 'NumberFilter',
                        delay: 1000,
                        numberComparators: [ '>', '<=' ],
                        defaultValue: { number: 0, comparator: '>' }
                      } }
                dataSort>Зарплата ср</TableHeaderColumn>
            </BootstrapTable>
        </div>

    }
    createCustomExportCSVButton(onClick) {
        return (
            <ExportCSVButton
                btnText='CustomExportText'
                btnContextual='btn-danger'
                className='my-custom-class'
                btnGlyphicon='glyphicon-edit'
                onClick={ e => this.handleExportCSVButtonClick(onClick) }/>
        );
    }
}

class Helper {
    static getAverageSumm(arr) {
        let avg = 0;

        arr.forEach((vacancy) => {
            avg += vacancy.avg;
        });
        avg = (avg/arr.length);

        return avg;
    }
}

export default Content;
