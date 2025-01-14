import { FC, useCallback, useEffect, useState, lazy, Suspense } from "react";
import classnames from "classnames/bind";
import { ButtonWrapper } from "src/components/ButtonWrapper/ButtonWrapper";
import { Button } from "src/components/Button/Button";
import { PopupHeader } from "../PopupHeader/PopupHeader";
import { useAppDispatch } from "src/store/store";
import {
  setColumnSelectorOpen,
  setCreateNewReportOpen,
} from "src/store/managerSlice";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import styles from "./ColumnSelector.module.scss";
import "./simplebar.scss";
import { ColumnListHeader } from "./ColumnListHeader/ColumnListHeader";
import { useFormContext } from "react-hook-form";
import { EDataKeys, IIFilters, RData } from "src/types";
import { DotSpinner } from "src/components/DotSpinner/DotSpinner";
import useFilterInitialization from "src/hook/useFilterInitialization";
import { useHandleCheckboxAll } from "src/hook/useHandleCheckboxAll";
import { ColumnSearchHeader } from "./ColumnListHeader/ColumnSearchHeader/ColumnSearchHeader";
import _ from "lodash";
const ColumnList = lazy(() => import("./ColumnList/ColumnList"));

const cx: CX = classnames.bind(styles);

interface IProps {
  onContinue: () => void;
}

export const ColumnSelector: FC<IProps> = ({ onContinue }) => {
  const { register, handleSubmit, watch } = useFormContext<RData>();
  const [searchValue, setSearchValue] = useState<string>("");
  const { filters, setFilters, isLoading } = useFilterInitialization();
  const [isColumnNotFound, setIsColumnNotFound] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { isChecked, handleCheckedAll, handleResetAll } = useHandleCheckboxAll(
    filters,
    setFilters
  );

  const handleCloseColumnSelector = useCallback(() => {
    dispatch(setColumnSelectorOpen(false));
    dispatch(setCreateNewReportOpen(true));
  }, [dispatch]);

  useEffect(() => {
    register(EDataKeys.FILTERS);
  }, [register]);

  const onSubmit = useCallback(
    (data: RData) => {
      const checkList = watch(EDataKeys.FILTERS) as IIFilters[];
      const check = _.find(checkList, (item) => item.selectedTableCell);
      setIsColumnNotFound(true);
      if (!_.isEmpty(check)) {
        onContinue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onContinue]
  );

  useEffect(() => {
    if (isColumnNotFound) {
      const timer = setTimeout(() => {
        setIsColumnNotFound(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isColumnNotFound]);

  const handleResetColumns = useCallback(() => {
    handleResetAll();
  }, [handleResetAll]);

  const handleSearchChange = useCallback((newValue: string) => {
    setSearchValue(newValue);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("column-selector")}>
        <PopupHeader
          title={"Column Selector"}
          onClose={handleCloseColumnSelector}
        />
        <div className={cx("column-wrapper")}>
          <div className={cx("search-wrapper")}>
            <ColumnSearchHeader
              isChecked={isChecked}
              handleCheckedAll={handleCheckedAll}
              isLoading={isLoading}
              handleSearchChange={handleSearchChange}
              searchValue={searchValue}
            />
          </div>

          <div className={cx("column-list")}>
            <ColumnListHeader />
            <SimpleBar
              style={{ maxHeight: "403px" }}
              className="my-custom-scrollbar-column"
            >
              {isLoading ? (
                <div className={cx("is-loading")}>
                  <DotSpinner />
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className={cx("is-loading")}>
                      <DotSpinner />
                    </div>
                  }
                >
                  <ColumnList
                    searchValue={searchValue}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </Suspense>
              )}
            </SimpleBar>
          </div>
        </div>
        <ButtonWrapper shift={"left"}>
          <Button
            primary
            type="submit"
            title="Configure filters"
            style={{ width: "132px" }}
          />
          <Button
            title="Reset Columns"
            onClick={handleResetColumns}
            style={{ width: "128px", marginLeft: "16px" }}
          />
          {isColumnNotFound && (
            <div className={cx("is-column-not-found")}>
              <span>Please select at least one column to proceed.</span>
            </div>
          )}
        </ButtonWrapper>
      </div>
    </form>
  );
};
