type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

export function isConstrainedConnection(navigatorValue: Navigator): boolean {
  const connection = (navigatorValue as NavigatorWithConnection).connection;

  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g",
  );
}

export function getGalleryLoadMargin(navigatorValue: Navigator): string {
  const connection = (navigatorValue as NavigatorWithConnection).connection;

  if (isConstrainedConnection(navigatorValue)) return "0px";
  return connection?.effectiveType === "4g" ? "600px 0px" : "200px 0px";
}

export function canPrefetchImages(navigatorValue: Navigator): boolean {
  const connection = (navigatorValue as NavigatorWithConnection).connection;
  return Boolean(!connection?.saveData && connection?.effectiveType === "4g");
}
