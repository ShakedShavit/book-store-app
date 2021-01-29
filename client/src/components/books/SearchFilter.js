import React, { useEffect, useState } from 'react';
import downArrowSymbol from '../../images/books/arrow-sign4.png';

const SearchFilter = (props) => {
    const [filterOptionClassList, setFilterOptionClassList] = useState('filter-option filter-option__hide');
    const [areFilterOptionsOpen, setAreFilterOptionsOpen] = useState(false);
    const [chosenSelection, setChosenSelection] = useState('');
    const [filterArrowClassList, setFilterArrowClassList] = useState('filter-arrow filter-arrow__closed');

    const openOrCloseFilterOptions = () => {
        if (areFilterOptionsOpen) {
            closeFilterOptions();
        } else {
            openFilterOptions();
        }
        setAreFilterOptionsOpen(!areFilterOptionsOpen);
    }

    const closeFilterOptions = () => {
        setFilterOptionClassList('filter-option filter-option__hide');
    }
    const openFilterOptions = () => {
        setFilterOptionClassList('filter-option');
    }

    const firstOptionOnClick = () => {
        setChosenSelection('Cheapest to most expensive');
        openOrCloseFilterOptions();
        props.setBooksToDisplay(bubbleSort(props.booksToDisplay, 'FIRST__OPTION'));
    }

    const secondOptionOnClick = () => {
        setChosenSelection('Most expensive to cheapest');
        openOrCloseFilterOptions();
        props.setBooksToDisplay(bubbleSort(props.booksToDisplay, 'SECOND__OPTION'));
    }

    useEffect(() => {
        if (areFilterOptionsOpen) {
            setFilterArrowClassList('filter-arrow filter-arrow__open')
        } else {
            setFilterArrowClassList('filter-arrow filter-arrow__closed')
        }
    }, [areFilterOptionsOpen]);

    useEffect(() => {
        if (props.shouldCloseFilterList) {
            props.setShouldCloseFilterList('false');
            closeFilterOptions();
            setAreFilterOptionsOpen(false);
        }
    }, [props.shouldCloseFilterList]);

    const swapTwoElementsInArray = (arr, i1, i2) => {
        const el1Val = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = el1Val;
    }

    const bubbleSort = (arr, sectionType) => {
        let hasSwapped;
        do {
            hasSwapped = false;
            for (let i = 0; i < arr.length - 1; i++) {
                if (sectionType === 'FIRST__OPTION') {
                    if (arr[i].price > arr[i + 1].price) {
                        swapTwoElementsInArray(arr, i, i + 1);
                        hasSwapped = true;
                    }
                }
                else if (sectionType === 'SECOND__OPTION') {
                    if (arr[i].price < arr[i + 1].price) {
                        swapTwoElementsInArray(arr, i, i + 1);
                        hasSwapped = true;
                    }
                }
            }
        } while (hasSwapped);
    
        props.setRenderBooksList(!props.renderBooksList);
        return arr;
    }

    return (
        <div className="search-filter-list">
            {
                chosenSelection === '' ?
                <span className="filter-opener" onClick={openOrCloseFilterOptions}><span></span>Filter <img src={downArrowSymbol} className={filterArrowClassList}></img></span> :
                <span className="filter-opener" onClick={openOrCloseFilterOptions}><span></span>{chosenSelection} <img src={downArrowSymbol} className={filterArrowClassList}></img></span>
            }
            <span className={filterOptionClassList} onClick={firstOptionOnClick}>Cheapest &#x2192; most expensive</span>
            <span className={filterOptionClassList} onClick={secondOptionOnClick}>Most expensive &#x2192; cheapest</span>
        </div>
    )
}

export default SearchFilter;