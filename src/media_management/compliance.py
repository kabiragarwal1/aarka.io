from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List

from .models import ComplianceSettings, ContentAsset


_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_PHONE_RE = re.compile(r"\+?\d[\d\-\s]{7,}\d")


@dataclass(slots=True)
class ComplianceResult:
    approved: bool
    warnings: List[str]
    blocked_reasons: List[str]


class ComplianceGuard:
    """Validates assets against baseline HIPAA/GDPR do's and don'ts."""

    def __init__(self, settings: ComplianceSettings) -> None:
        self.settings = settings

    def review(self, asset: ContentAsset) -> ComplianceResult:
        warnings: List[str] = []
        blocked: List[str] = []
        text = f"{asset.title}\n{asset.body}"

        if self.settings.pii_detection:
            if _EMAIL_RE.search(text):
                blocked.append("Remove direct email addresses before publishing.")
            if _PHONE_RE.search(text):
                blocked.append("Remove phone-like personal identifiers before publishing.")

        if self.settings.hipaa_mode and "patient" in text.lower():
            blocked.append(
                "Avoid patient-specific health references unless fully de-identified and consented."
            )

        if self.settings.gdpr_mode and "track" in text.lower() and self.settings.require_consent_for_tracking:
            warnings.append("Ensure explicit consent banner is active for EU traffic.")

        if "guaranteed cure" in text.lower():
            blocked.append("Unsubstantiated medical claims are not allowed.")

        return ComplianceResult(approved=not blocked, warnings=warnings, blocked_reasons=blocked)


DOS_AND_DONTS = {
    "dos": [
        "Do collect explicit consent before personalized ad targeting in GDPR regions.",
        "Do pseudonymize audience identifiers before analytics processing.",
        "Do retain audit logs for each publication and optimization change.",
        "Do use region-aware content approval workflows.",
    ],
    "donts": [
        "Don't publish Protected Health Information (PHI) in creatives.",
        "Don't run cross-border data transfers without approved safeguards.",
        "Don't auto-optimize into restricted audience segments.",
        "Don't keep raw personal data longer than policy permits.",
    ],
}
