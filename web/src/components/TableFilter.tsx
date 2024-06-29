import { FC, useEffect, useMemo, useReducer } from "react";

import {
  DatabaseProperties,
  DatabaseProperty,
  QueryRequestFilterParam,
} from "../types/notion";
import { isSupportPropertyType } from "../utils/isSupportPropertyType";

type Props = {
  dbProperties: DatabaseProperties;
  filter?: QueryRequestFilterParam;
  setFilter: (filter: QueryRequestFilterParam) => void;
};

type FilterValue = boolean | string | number;

type State = {
  property?: string;
  method?: string;
  value?: FilterValue;
};

const reducer = (
  state: State,
  action:
    | { type: "SET_PROPERTY"; payload: string }
    | { type: "SET_METHOD"; payload: string }
    | { type: "SET_VALUE"; payload: FilterValue }
    | { type: "RESET" }
) => {
  switch (action.type) {
    case "SET_PROPERTY":
      return {
        ...state,
        property: action.payload,
        method: undefined,
        value: undefined,
      };
    case "SET_METHOD":
      return { ...state, method: action.payload };
    case "SET_VALUE":
      return { ...state, value: action.payload };
    case "RESET":
      return {};
    default:
      return state;
  }
};

export const TableFilter: FC<Props> = (props) => {
  const { dbProperties, setFilter } = props;

  const columnNames = useMemo(
    () =>
      Object.entries(dbProperties)
        .filter(([_, { type }]) => isSupportPropertyType(type))
        .map(([name]) => name),
    [dbProperties]
  );

  const [state, dispatch] = useReducer(reducer, {});
  const { property, method, value } = state;

  const setProperty = (payload: string) => {
    dispatch({ type: "SET_PROPERTY", payload });
  };

  const setMethod = (payload: string) => {
    dispatch({ type: "SET_METHOD", payload });
  };

  const setValue = (payload: FilterValue) => {
    dispatch({ type: "SET_VALUE", payload });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const selectedProperty = property ? dbProperties[property] : undefined;

  useEffect(() => {
    if (
      typeof property === "string" &&
      typeof method === "string" &&
      typeof value !== "undefined" &&
      selectedProperty !== undefined
    ) {
      setFilter({
        property,
        [selectedProperty.type]: { [method]: value },
      } as any); // Not ideal to cast to any, but I don't have to to strongly type the whole filter object for every property type
    } else {
      setFilter(undefined);
    }
  }, [property, method, value, selectedProperty, setFilter]);

  return (
    <div>
      <div>{"Filter"}</div>

      <button>{"+ Add a filter"}</button>
      <div>
        <select
          defaultValue={columnNames[0]}
          onChange={(e) => setProperty(e.target.value)}
        >
          {columnNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {selectedProperty ? (
          <FilterComponent
            property={selectedProperty}
            method={method}
            value={value}
            setMethod={setMethod}
            setValue={setValue}
          />
        ) : null}

        {!!selectedProperty && <button onClick={reset}>{"Reset"}</button>}
      </div>
    </div>
  );
};

type FilterProps = {
  method?: string;
  value?: FilterValue;
  setMethod: (method: string) => void;
  setValue: (value: FilterValue) => void;
};

const FilterComponent: FC<FilterProps & { property: DatabaseProperty }> = (
  props
) => {
  const { property } = props;

  if (property.type === "checkbox") {
    return <CheckBoxFilter {...props} property={property} />;
  }

  if (property.type === "select") {
    return <SelectFilter {...props} property={property} />;
  }

  return <div />;
};

const CheckBoxFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "checkbox" }>;
  }
> = (props) => {
  const { method, value, setMethod, setValue } = props;

  useEffect(() => {
    // Set initial value
    setMethod("equals");
    setValue(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        {["equals", "does_not_equal"].map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => setValue(e.target.checked)}
      />
    </>
  );
};

const SelectFilter: FC<
  FilterProps & {
    property: Extract<DatabaseProperty, { type: "select" }>;
  }
> = (props) => {
  const { property, method, value, setMethod, setValue } = props;

  const options = property.select.options.map((option) => option.name);

  useEffect(() => {
    // Set initial value
    setMethod("equals");
    setValue(options[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);

          // These two methods value always true
          if (["is_empty", "is_not_empty"].includes(e.target.value))
            setValue(true);
        }}
      >
        {["equals", "does_not_equal", "is_empty", "is_not_empty"].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )}
      </select>

      {!!method && ["equals", "does_not_equal"].includes(method) && (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};
