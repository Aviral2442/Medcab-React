import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Collapse,
} from "react-bootstrap";
import clsx from "clsx";
import {TbArrowRight} from 'react-icons/tb'


type ComponentCardProps = {
  title: React.ReactNode;
  isCollapsible?: boolean;
  isRefreshable?: boolean;
  isCloseable?: boolean;
  className?: string;
  bodyClassName?: string;
  onAddNew?: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
};

const ComponentCard = ({
  title,
  isCollapsible,
  className,
  bodyClassName,
  onAddNew,
  children,
  headerActions,
}: ComponentCardProps) => {
  const [isVisible, _setIsVisible] = useState(true);
  const [isCollapsed, _setIsCollapsed] = useState(false);
  const [isRefreshing, _setIsRefreshing] = useState(false);

  if (!isVisible) return null;

  return (
    <Card className={clsx(isCollapsed && "card-collapse", 'mt-2 mx-2', className)}>
      {isRefreshing && (
        <div className="card-overlay">
          <div className="spinner-border text-primary" />
        </div>
      )}

      <CardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <CardTitle className="mb-0">{title}</CardTitle>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {headerActions}
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="icon-link icon-link-hover link-secondary link-underline-secondary link-underline-opacity-25 fw-semibold bg-transparent border-0 p-0"
              style={{ textDecoration: "none" }}
            >
              Add New <TbArrowRight className="bi align-middle fs-lg"></TbArrowRight>
            </button>
          )}
        </div>
      </CardHeader>

      {isCollapsible ? (
        <Collapse in={!isCollapsed}>
          <CardBody className={bodyClassName}>{children}</CardBody>
        </Collapse>
      ) : (
        <CardBody className={bodyClassName}>{children}</CardBody>
      )}
    </Card>
  );
};

export default ComponentCard;
